import React, { Component } from "react";
import { Subject } from "rxjs";

const WithClicker = WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.clicker$ = new Subject();
      this.stop$ = new Subject();
      this.wrapper$ = new Subject();
      this.start();
    }

    start = () => {
      const { onComplete = _ => _ } = this.props;
      this.wrapper$.subscribe(_ => {
        this.clicker$
          .debounceTime(2000)
          .takeUntil(this.stop$)
          .take(1)
          .subscribe({
            next: onComplete,
            complete: _ => this.wrapper$.next()
          });
      });
      this.wrapper$.next();
    };

    componentWillUnmount() {
      this.stop$.next();
      this.wrapper$.complete();
      this.clicker$.complete();
      this.stop$.complete();
      this.wrapper$.unsubscribe();
      this.clicker$.unsubscribe();
      this.stop$.unsubscribe();
    }

    render() {
      return (
        <WrappedComponent
          emitClick={_ => this.clicker$.next()}
          emitStop={(endValue = "end") => this.stop$.next(endValue)}
          {...this.props}
        />
      );
    }
  };

export default WithClicker;
