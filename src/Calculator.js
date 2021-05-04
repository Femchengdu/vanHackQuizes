import React from "react";

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      operations: ["-", "+", "/", "*"],
      calculated: false,
    };
  }

  swapLastDisplay = (display, swapChar) => {
    const displayArr = display.split("");
    // remove last val
    displayArr.pop();
    // Add new last val
    displayArr.push(swapChar);
    // join to String
    const newDisplay = displayArr.join("");
    return newDisplay;
  };

  handleDigitClick = (value) => {
    this.setState((prevState) => {
      let { display, calculated } = prevState;

      if (calculated) {
        display = "";
        calculated = false;
      }

      if (display === "") {
        display = value;
      } else if (display === "0" && value === "0") {
        display = value;
      } else if (display === "0" && value !== "0") {
        display = value;
      } else if (display.length && display[display.length - 1] === "0") {
        // last value is zero
        const firstVal = display[0];
        if (firstVal === "-" && value === "0") {
          return;
        } else {
          // continue here
          display = display + value;
        }
      } else if (display.length) {
        // Display not null just append here
        display = display + value;
      }

      return {
        display,
        calculated,
      };
    });
  };

  handleClearDisplay = () => {
    this.setState({ display: "" });
  };

  handleOperation = (operation) => {
    let { operations, display } = this.state;
    // debugger;
    if (display.length) {
      const lastVal = display[display.length - 1];
      if (lastVal === "+" || lastVal === "-") {
        // last value is - or plus
        if (lastVal !== operation) {
          //display[display.length - 1] = value;
          display = this.swapLastDisplay(display, operation);
          this.setState({
            display,
          });
        }
      } else if (lastVal === "/" && lastVal !== operation) {
        this.setState({
          display: display + operation,
        });
      } else if (!operations.includes(lastVal)) {
        this.setState({
          display: display + operation,
        });
      }
    } else if (!display.length && operation === "-") {
      this.setState({
        display: display + operation,
      });
    }
    //this.setState({ display: "" });
  };

  calculate = (oldRes, oper, newInput) => {
    switch (oper) {
      case "-":
        return oldRes - newInput;
      case "+":
        return oldRes + newInput;

      case "/":
        if (newInput === 0 || newInput === -0) {
          return "";
        } else {
          return Math.floor(oldRes / newInput);
        }

      case "*":
        return oldRes * newInput;

      default:
        return oldRes;
    }
  };

  calculatFromString = (strVal, negFirst) => {
    const { operations } = this.state;
    let val1 = "";
    let opa = "";
    let val2 = "";
    let curMode = "v1";
    let signV2;
    const strLength = strVal.length;
    let result;
    for (let i = 0; i < strLength; i++) {
      if (val1 && opa && val2 && i !== strLength - 1 && curMode === "o") {
        // You need do do your calculation here
        result = this.calculate(
          negFirst ? -parseInt(val1) : parseInt(val1),
          opa,
          val2
        );

        let newStr = strVal.slice(i);
        const combStr = result.toString() + newStr;

        if (combStr) {
          //   debugger;
          console.log(combStr);
          return this.calculatFromString(combStr);
        }

        // create a new string val
        // then reset once you are done.
        // tempRes = this.calculate(v1, op, v2)
        // reset v1, v2, v3 and current mode to 'o'
      } else if (
        //
        val1 &&
        opa &&
        val2 &&
        i === strLength - 1 &&
        curMode === "o"
      ) {
        // normal mode end here
        console.log("do we have a result already ?", result);
        // Return the result or continue the calculation
      }
      let curVal = strVal[i];
      if (!operations.includes(curVal)) {
        if (curMode === "v1") {
          val1 = val1 + curVal;

          if (strVal[i + 1] && operations.includes(strVal[i + 1])) {
            // change the curMode
            curMode = "o";
          }
        } else if (curMode === "v2") {
          val2 = val2 + curVal;
          if (strVal[i + 1] && operations.includes(strVal[i + 1])) {
            // change the curMode
            curMode = "o";
          }
        }
      } else if (curMode === "o") {
        debugger;
        opa = curVal;
        if (strVal[i + 1] && !operations.includes(strVal[i + 1])) {
          // change the curMode
          curMode = "v2";
        } else if (strVal[i + 1] && operations.includes(strVal[i + 1])) {
          // possible negative operation
          curMode = "oo";
        }
      } else if (curMode === "oo") {
        // how do I handle you?
        if (strVal[i + 1] && !operations.includes(strVal[i + 1])) {
          // change the curMode
          curMode = "v2";
          signV2 = curVal;
        }
      }
    }
    result = this.calculate(
      negFirst ? -parseInt(val1) : parseInt(val1),
      opa,
      signV2 === "-" ? -parseInt(val2) : parseInt(val2)
    );
    return result;
  };

  handleCompute = () => {
    let { display } = this.state;
    // const lastVal = display[display.length - 1];
    const firststVal = display[0];

    if (firststVal === "-") {
      const newDisp = display.slice(1);
      const result = this.calculatFromString(newDisp, true);
      console.log("The result after calculation is :", result);
      this.setState({ display: result, calculated: true });
    } else if (!firststVal) {
      return;
    } else {
      const result = this.calculatFromString(display);
      console.log("The result after calculation is :", result);
      this.setState({ display: result, calculated: true });
    }
  };

  render() {
    const { display } = this.state;
    console.log("The display is : ", display);
    return (
      <div className="calculator">
        <div className="output">{display}</div>
        {/*Digits*/}
        <button className="digit-0" onClick={() => this.handleDigitClick("0")}>
          0
        </button>
        <button className="digit-1" onClick={() => this.handleDigitClick("1")}>
          1
        </button>
        <button className="digit-2" onClick={() => this.handleDigitClick("2")}>
          2
        </button>
        <button className="digit-3" onClick={() => this.handleDigitClick("3")}>
          3
        </button>
        <button className="digit-4" onClick={() => this.handleDigitClick("4")}>
          4
        </button>
        <button className="digit-5" onClick={() => this.handleDigitClick("5")}>
          5
        </button>
        <button className="digit-6" onClick={() => this.handleDigitClick("6")}>
          6
        </button>
        <button className="digit-7" onClick={() => this.handleDigitClick("7")}>
          7
        </button>
        <button className="digit-8" onClick={() => this.handleDigitClick("8")}>
          8
        </button>
        <button className="digit-9" onClick={() => this.handleDigitClick("9")}>
          9
        </button>

        {/*Operators*/}
        <button className="op-add" onClick={() => this.handleOperation("+")}>
          Add
        </button>
        <button className="op-sub" onClick={() => this.handleOperation("-")}>
          Sub
        </button>
        <button className="op-mul" onClick={() => this.handleOperation("*")}>
          Mul
        </button>
        <button className="op-div" onClick={() => this.handleOperation("/")}>
          Div
        </button>
        <button className="eq" onClick={this.handleCompute}>
          EQ
        </button>
        <button className="clear" onClick={this.handleClearDisplay}>
          CLS
        </button>
      </div>
    );
  }
}
