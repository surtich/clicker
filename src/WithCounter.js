import React, { Component } from "react";
import { Subject, Observable } from "rxjs";

const WithCounter = WrappedComponent =>
  class extends Component {
    start = () => {
      const { onNext, onComplete } = this.props;
      this.counter$ = new Subject();
      this.immediateEnd$ = new Subject();
      this.counter$.startWith(0);
      const accumulator$ = this.counter$.scan((ticks, one) => ticks + one);
      const end$ = this.counter$.switchMap(() =>
        Observable.merge(Observable.of("end").delay(2000), this.immediateEnd$)
      );
      accumulator$.takeUntil(end$).subscribe(
        onNext,
        error => console.log("Error", error),
        () => {
          onComplete();
          this.start();
        }
      );
    };

    componentDidMount() {
      this.start();
    }

    componentWillReceiveProps(nextProps) {
      const { emitEnd } = nextProps;
      if (emitEnd) {
        this.immediateEnd$.next("end");
      }
    }

    render() {
      return (
        <WrappedComponent
          next={(inc = 1) => this.counter$.next(inc)}
          end={() => this.immediateEnd$.next("end")}
          {...this.props}
        />
      );
    }
  };

export default WithCounter;
