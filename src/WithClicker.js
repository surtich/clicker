import React, { Component } from "react";
import { Subject, Observable } from "rxjs";

const WithClicker = WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.stop$ = new Subject();
    }
    start = () => {
      const { onNext = _ => _, onComplete = _ => _ } = this.props;
      this.counter$ && this.counter$.unsubscribe();
      this.counter$ = new Subject();
      this.counter$.startWith(0);
      const accumulator$ = this.counter$.scan((ticks, one) => ticks + one);
      const end$ = this.counter$
        .switchMap(() =>
          Observable.merge(Observable.of("end").delay(4000), this.stop$)
        )
        .take(1);
      end$.subscribe(
        endValue => endValue !== "cancel" && onComplete(),
        _ => _,
        () => console.log("end!")
      );
      accumulator$.takeUntil(end$).subscribe(
        onNext,
        error => console.log("Error in WithClicker: ", error),
        () => {
          console.log(this.counter$);
          this.start();
        }
      );
    };

    componentDidMount() {
      this.start();
    }

    componentWillUnmount() {
      this.counter$ && this.counter$.unsubscribe();
      this.stop$.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
      const { emitEnd } = nextProps;
      if (emitEnd) {
        this.stop$.next(emitEnd);
      }
    }

    render() {
      return (
        <WrappedComponent
          next={(inc = 1) => this.counter$.next(inc)}
          stop={endValue => this.stop$.next((endValue = "end"))}
          {...this.props}
        />
      );
    }
  };

export default WithClicker;
