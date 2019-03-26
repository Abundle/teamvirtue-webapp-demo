import { connect } from 'react-redux';
import App from '../App';
import {
    updateWeatherData,
    updateWeatherForecastData,
    updateEnergyUsageAll,
    updateIndoorTemperature,
    updateEnergyUsageRealtime
} from '../actions';

const mapStateToProps = (state) => {
    return {
        sustainabilityStatus: state.sustainabilityStatus,
    }
};

const mapDispatchToProps = dispatch => ({
    updateWeatherData: (celsius, description, sunrise, sunset) => {
        dispatch(updateWeatherData(celsius, description, sunrise, sunset));
    },
    updateWeatherForecastData: (forecast3hDatetime, forecast3hCelsius, forecast3hDescription, forecast6hDatetime, forecast6hCelsius, forecast6hDescription) => {
        dispatch(updateWeatherForecastData(forecast3hDatetime, forecast3hCelsius, forecast3hDescription, forecast6hDatetime, forecast6hCelsius, forecast6hDescription));
    },
    updateIndoorTemperature: () => {
		dispatch(updateIndoorTemperature());
	},
    updateEnergyUsage: (room) => {
		dispatch(updateEnergyUsageAll(room));
		dispatch(updateEnergyUsageRealtime(room));
	},
});

export const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);