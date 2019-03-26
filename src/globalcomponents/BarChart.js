import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

let labels = [];

const energyGraph = {
	labels: labels,
	datasets:[{
		label: 'Energy Usage',
		data: [],
		backgroundColor: 'rgba(241, 93, 39, 0.5)',
		borderColor: '#f15b27',
		datalabels: {
			align: 'end',
			anchor: 'end'
		}
	}]
};


const styles = {
    root: {
		width: '100%',
		textAlign: 'center',
    },
    radioGroup: {
        justifyContent: 'center',
        marginBottom: 50,
    },
    radioButton: {
        display: 'inline',
        margin: 0,
    },
    water: {
        color: '#0EA4D8',
    }
};

class BarChart extends Component{
    constructor(props){
        super(props);

        // Chart.defaults.global.defaultFontColor = 'red';

        this.state = {
            value: 'week',
			data: energyGraph,
        };
    }

    componentWillMount() {
		if (labels.length < 1) {
            this.props.data.forEach(data => {
                labels.push(data[0]);
            })
		}
    };
	
	componentWillReceiveProps() {
		// okay, so new data retrieved. Now update the array data correctly.
		let datasetsCopy = this.state.data.datasets.slice(0);

        let dataCopy = [];
        this.props.data.forEach(data => {
            dataCopy.push(data[1]);
        });
		
		datasetsCopy[0].data = dataCopy;
        let finalData = Object.assign( {}, this.state.data, { datasets: datasetsCopy } );
		this.setState({
			data: finalData
		});
	};


    render(){
        const { classes } = this.props;

        return (
            <div className={ classes.root }>
                { /* <RadioGroup
                    aria-label='time'
                    name='time'
                    className={ classes.radioGroup }
                    value={ this.state.value }
                    onChange={ this.handleChange }
                    row
                >
                    <FormControlLabel className={ classes.radioButton } value='week' control={ <Radio color="primary" /> } label='Week'/>
                    <FormControlLabel className={ classes.radioButton } value='month' control={ <Radio color="primary" /> } label='Month'/>
                    <FormControlLabel className={ classes.radioButton } value='year' control={ <Radio color="primary" /> } label='Year'/>
                </RadioGroup> */ }
                <HorizontalBar
                    data={ this.state.data }
                    options={{
                        tooltips: {
                            enabled: false
                        },
                        layout: {
                            padding: {
                                left: 30,
                                right: 35,
                                top: 0,
                                bottom: 0,
                            }
                        },
                        legend: {
                            display: false,
                        },
                        scales: {
                            xAxes: [{
                                display: false,
                                ticks: {
                                    fontFamily: "inherit",
                                    fontColor: 'gray',
                                },
                            }],
                            yAxes: [{
                                gridLines: {
                                    color: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                },
                                ticks: {
                                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value
                                    fontFamily: "inherit",
                                    fontColor: 'gray',
                                },
                            }]
                        },
                        elements: {
                            point: {
                                radius: 0,
                            },
                        },
                        plugins: {
                            datalabels: {
                                backgroundColor: function(context) {
                                    return context.dataset.borderColor;
                                },
                                borderRadius: 100,
                                color: 'white',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: Math.round
                            },
                        },
                        responsive: true,
                    }}
                />
            </div>
        )
    }
}

export default withStyles(styles)(BarChart);