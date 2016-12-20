import React, { Component } from 'react';
import {
    View,
    Text,
    AppRegistry
} from 'react-native';
import Style from './Style';

import InputButton from './InputButton';

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+'],
    ['C', 'CE']
];

class ReactCalculator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            previousInputValue: 0,
            inputValue: 0,
            //intValue: 0,
            totalValue: '',
            fractionValue: 0,
            isFraction: false,
            selectedSymbol: null
        }
    }

    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer}>
                    <Text style={Style.displayText}>{this.state.totalValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                    {this._renderInputButtons()}
                </View>
            </View>
        )
    }

    /**
     * For each row in `inputButtons`, create a row View and add create an InputButton for each input in the row.
     */
    _renderInputButtons() {
        let views = [];

        for (var r = 0; r < inputButtons.length; r ++) {
            let row = inputButtons[r];

            //console.warn(row);

            let inputRow = [];
            for (var i = 0; i < row.length; i ++) {
                let input = row[i];

                //console.warn(input);

                inputRow.push(
                    <InputButton
                        value={input}
                        highlight={this.state.selectedSymbol === input}
                        onPress={this._onInputButtonPressed.bind(this, input)}
                        key={r + "-" + i}/>
                );

            }

            views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
        }

        return views;
    }

    _onInputButtonPressed(input) {

        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input)
            case 'string':
                return this._handleStringInput(input)
        }
    }

    _handleNumberInput(num) {

        let inputValue = (this.state.inputValue * 10) + num;
        this.setState({
            inputValue: inputValue,
            totalValue: inputValue
        }/*, () => console.warn(this.state.inputValue)*/);

        if(this.state.isFraction){
            let fractionValue = num;
            this.setState({
                fractionValue: fractionValue,
                totalValue: this.state.totalValue + fractionValue
            });
            //console.warn(typeof(this.state.totalValue));
            //console.warn(fractionValue);
        }
    }

    _handleStringInput(str) {
        switch (str) {
            case '*':
            case '+':
            case '-':
            case '/':
                this.setState({
                    selectedSymbol: str,
                    previousInputValue: Number(this.state.totalValue),
                    inputValue: 0,
                    totalValue: 0,
                    isFraction: false
                });
                break;

            case '.':
                this.setState({
                    //inputValue:
                    isFraction: true,
                    inputValue: this.state.inputValue,
                    totalValue: this.state.inputValue + "."
                }/*, () => console.warn(this.state.inputValue)*/);
                break;

            case '=':
                let symbol = this.state.selectedSymbol,
                    inputValue = this.state.inputValue,
                    previousInputValue = this.state.previousInputValue;
                    //totalValue =  this.state.inputValue;

                if (!symbol) {
                    return;
                }

                this.setState({
                    previousInputValue: 0,
                    inputValue: eval(previousInputValue + symbol + inputValue),
                    selectedSymbol: null,
                    totalValue: eval(previousInputValue + symbol + inputValue)
                });

                break;

            case 'CE':

                this.setState({
                    previousInputValue: 0,
                    inputValue: 0,
                    totalValue: 0,
                    selectedSymbol: null
                });

                break;

            case 'C':

                this.setState({
                    inputValue: (this.state.inputValue - (this.state.inputValue % 10 ))/10,
                    totalValue: (this.state.inputValue - (this.state.inputValue % 10 ))/10
                });
                //break;
        }
    }
}

AppRegistry.registerComponent('ReactCalculator', () => ReactCalculator);