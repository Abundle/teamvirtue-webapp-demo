import React, { Component } from 'react';
import List from '@material-ui/core/List';

// Local import
import Light from '../controlComponents/Light';

class DinnerRoom extends Component {

    render() {
        return (
			<List>
				<div>
					<Light forRoom='Dinner Room' />
				</div>
			</List>
        );
    }
}

export default DinnerRoom;