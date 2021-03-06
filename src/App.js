import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { defaults } from 'react-chartjs-2';

// Local import
import { MainNavigationContainer } from './containers/MainNavigationContainer';
import './assets/bootstrap-grid.min.css';
import './index.css';

const theme = createMuiTheme({
    palette: {
		primary: {
			main: '#f15b27', /* ADJUST THEME COLOR HERE */
		},
		secondary: {
			main: '#181818',
            light: '#ffffff',
		},
		error: {
			main: '#e83a3a', //inverted (blue): 0EA4D8
		},
	},
	typography: {
		fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
		fontSize: 20,
	},
    overrides: {
        MuiBottomNavigationAction: {
            // Name of the styleSheet
            root: {
                // Name of the rule
                flex: '1',
                '&$selected': {
                    paddingTop: 8,
                },
            },
            label: {
                fontSize: 12,
                '&$selected': {
                    fontSize: 12, //theme.typography.pxToRem(12)
                },
            },
        },
		MuiPaper: {
			elevation1: {
				boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 1px 0px rgba(0, 0, 0, 0.07), 0px 2px 1px -1px rgba(0, 0, 0, 0.06)',
			}
		},
		MuiCard: {
			root: {
				marginBottom: 30,
			},
		},
    },
});

//chart.js settings
defaults.global.elements.line.borderColor = theme.palette.primary.main;
defaults.global.elements.point.backgroundColor = theme.palette.primary.main;
defaults.global.elements.point.borderColor = theme.palette.primary.main;
defaults.global.elements.point.hitRadius = 15;


class App extends Component {
	componentDidMount() {
	// async componentDidMount() {
		// Call Public API's every 5 minutes
		this.loadPublicData();
		this.intervalId = setInterval(() => this.loadPublicData(), 5 * 60 * 1000);
		
		// Load API data every 20 seconds
		/* TODO: use promises to do this directly - and only do this - after successful retrieval of token (the call in asyncActions.js can then be removed too) */
		this.loadApiData();
		setInterval(() => this.loadApiData(), 10000); //5 minutes = 5 * 60 * 1000
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}
	
	loadApiData() {
		// TODO: ok bad fix. Just wait 10 seconds with data loading (assuming that token is retrieved)
		this.props.updateIndoorTemperature();
        this.props.updateEnergyUsage('All Rooms');
		/* this.props.updateEnergyUsage('All Rooms', 'realtime'); <<<------ kan je niet gewoon laatste value pakken van 'all'?? */
        this.props.updateEnergyUsage('Technical Room');
        this.props.updateEnergyUsage('Outdoor');
        this.props.updateEnergyUsage('Living Room');
        this.props.updateEnergyUsage('Kitchen');
        this.props.updateEnergyUsage('Hallway');
        this.props.updateEnergyUsage('Dinner Room');
        this.props.updateEnergyUsage('Bedroom');
        this.props.updateEnergyUsage('Bathroom');
	}

	loadPublicData() {
		/* 
		 * OPEN WEATHER MAP
		 *
		 * ID Eindhoven: 2756252
		 * ID Dubai: 292223
		 */
		
		// Current Weather
		let weatherURL = 'https://api.openweathermap.org/data/2.5/weather?id=292223&APPID=1473962c711c59e516b01eb4065ce872&units=metric';
		fetch(weatherURL)
			.then(response => response.json())
			.then(
				(result) => {
					let celsius = Math.ceil(result.main.temp);
					let description = result.weather[0].description;
					description = description.charAt(0).toUpperCase() + description.slice(1);
					let sunrise = result.sys.sunrise;
					let sunset = result.sys.sunset;
					
					this.props.updateWeatherData(celsius, description, sunrise, sunset);
				},
				(error) => {
					console.log('Error fetching current temperature [OpenWeatherMap API]: ' + error);
				}
			);
		
		// Forecast Weather
		let weatherForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?id=292223&APPID=1473962c711c59e516b01eb4065ce872&units=metric';
		fetch(weatherForecastURL)
			.then(res => res.json())
			.then(
				(result) => {
					let forecast3hDatetime = result.list[0].dt;
					let forecast3hCelsius = Math.ceil(result.list[0].main.temp);
					let forecast3hDescription = result.list[0].weather[0].description;
					let forecast6hDatetime = result.list[1].dt;
					let forecast6hCelsius = Math.ceil(result.list[1].main.temp);
					let forecast6hDescription = result.list[1].weather[0].description;
					
					forecast3hDescription = forecast3hDescription.charAt(0).toUpperCase() + forecast3hDescription.slice(1);
					forecast6hDescription = forecast6hDescription.charAt(0).toUpperCase() + forecast6hDescription.slice(1);
					
					this.props.updateWeatherForecastData(forecast3hDatetime, forecast3hCelsius, forecast3hDescription, forecast6hDatetime, forecast6hCelsius, forecast6hDescription);
				},
				(error) => {
					console.log('Error fetching forecast temperature [OpenWeatherMap API] ' + error);
				}
			);
	}

    render() {
		const { sustainabilityStatus } = this.props;
		
        return (
            <div id='app' className={ (sustainabilityStatus.fullscreen ? 'fullscreen' : '') }>
				<MuiThemeProvider theme={ theme }>
					<MainNavigationContainer />
				</MuiThemeProvider>
            </div>
        );
    }
}

export default App;
