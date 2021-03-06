import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';

// Local import
import Temperature from '../controlComponents/Temperature';
import RealtimeEnergyMeter from '../controlComponents/RealtimeEnergyMeter';
import NetEnergy from '../controlComponents/NetEnergy';
import RealtimeEnergyBar from '../controlComponents/RealtimeEnergyBar';

class Apartment extends Component {

    render() {
	
        return (
            <List className='row'>
				<div className='col-6'>
					<Temperature />
				</div>
				
				<div className='col-6'>
					<RealtimeEnergyMeter forRoom={ [{ 'roomname': 'All Rooms', 'energyname': 'All Rooms' }] } />
				</div>

				<div className='col-12'>
					<NetEnergy forRoom='All Rooms' />
				</div>

				{/*<WaterUsage />*/}
				
				<div className='col-12'><RealtimeEnergyBar title='Usage per room (kWh)' showData={ ['Living Room', 'Kitchen', 'Dinner Room', 'Bedroom', 'Bathroom', 'Hallway', 'Technical Room', 'Outdoor'] } /></div>
            </List>
        );
    }
}

const mapDispatchToProps = dispatch => ({
});

export default connect(null, mapDispatchToProps)(Apartment);