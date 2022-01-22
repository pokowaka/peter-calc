import React from "react";
import { Jsep } from 'jsep';

export default class CalcForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', result: 'Unknown' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    let parsed = Jsep.parse(this.state.value)
    console.log(parsed)
    this.setState({ result: this.peterCalc(parsed) })
    event.preventDefault();
  }

  peterCalc(tree) {
    switch (tree.type) {
      case 'BinaryExpression':
        switch (tree.operator) {
          case '+': return this.peterCalc(tree.left) + this.peterCalc(tree.right)
          case '-': return this.peterCalc(tree.left) - this.peterCalc(tree.right)
          case '/': return this.peterCalc(tree.left) / Math.abs(this.peterCalc(tree.right))
          case '*': return this.peterCalc(tree.left) * Math.abs(this.peterCalc(tree.right))
          case '^': {
            const left = this.peterCalc(tree.left)
            const right = this.peterCalc(tree.right)
            if (left < 0) {
              if (right < 0) {
                return -Math.abs(Math.pow(left, Math.abs(right)))
              } else {
                return -Math.abs(Math.pow(left, right))
              }
            }
            return Math.pow(left, right)
          }
          default: return "Error, unsupported binary operator: " + tree.operator
        }
      case 'Literal':
        /* stuff */
        return tree.value
      case 'UnaryExpression':
        switch (tree.operator) {
          case '+': return this.peterCalc(tree.argument)
          case '-': return -this.peterCalc(tree.argument)
          case '!':
            const val = this.peterCalc(tree.argument)
            if (val < 0) return -Math.sqrt(-val)
            return Math.sqrt(val)
          default: return "Error, unary operator: " + tree.argument.operator
        }
      default:
      /* borked  */
    }
  }

  render() {
    const { value, result } = this.state
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <p>Expression:</p>
            <input type="p" value={value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Calculate" />
        </form>
        <p>Result: {result}</p>
      </div>
    );
  }
}