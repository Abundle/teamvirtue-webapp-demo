import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation  from '@material-ui/core/BottomNavigation';
import BottomNavigationAction  from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

// local import
import { HomeContainer } from '../containers/HomeContainer';
import RoomNavigation from './rooms/RoomNavigation';
import { AppSettingsContainer } from '../containers/AppSettingsContainer';
import { SustainabilityStatusCircleContainer } from '../containers/SustainabilityStatusCircleContainer';
import { NotificationsDialogContainer } from '../containers/NotificationsDialogContainer';
import '../index.css';
import logo from '../assets/linq_logo_white.png';
import linqBg from '../assets/linq_top_down_view.jpg';

const styles = {
    root: {
        position: 'relative',
    },
	bg: {
		backgroundImage: 'url("' + linqBg +'")',
		backgroundSize: 'cover',
		backgroundAttachment: 'fixed',
	},
	logo: {
		position: 'absolute',
		left: 0,
		margin: '23px 20px',
		zIndex: 1,
		'&:hover': {
			cursor: 'pointer',
		}
	},
    mobileNav: {
        position: 'fixed',
        bottom: 0,
		marginLeft: '-15px',
        zIndex: 5,
        width: '100%',
        boxShadow: '0px -3px 3px 0px rgba(0, 0, 0, 0.10)',
		backgroundColor: 'white',
    },
    mobileNavItem: {
        minWidth: '60px',
    },
    checked: {
		backgroundColor: 'rgba(255, 255, 255, 0.3) !important',
    },
};


class MainNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'home',
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
		if (value !== this.state.value) {
			this.props.updateSustainabilityStatus('mylinq');
		}
    };

    handleClick = (name) => {
        this.setState({ value: name });
		if (name !== this.state.value) {
			this.props.updateSustainabilityStatus('mylinq');
		}
    };

    render() {
        const { classes, sustainabilityStatus } = this.props;
        const { value } = this.state;

        return (
            <div className={ classes.root }>
				<img className={ classes.logo } src={ logo } width='80' alt='LINQ logo' onClick={ () => this.handleClick('home') } />
				<NotificationsDialogContainer />
				
				<div className={ 'wrapper ' + value }>
					<div className={ 'row ' + classes.bg } style={{ position: 'relative' }}>
						<div className={ 'fluid-container headerBg' } style={{ zIndex: sustainabilityStatus.fullscreen ? 10 : 0 }}>
							<SustainabilityStatusCircleContainer view={ value } />
						</div>
						
						<div className={ 'content' }>
							{ value === 'home' && <HomeContainer /> }
							{ value === 'rooms' && <RoomNavigation /> }
							{ value === 'settings' && <AppSettingsContainer /> }
						</div>
					</div>
				</div>

                { !sustainabilityStatus.fullscreen &&
                    <BottomNavigation value={ value } onChange={ this.handleChange } className={ classes.mobileNav } showLabels>
                        <BottomNavigationAction className={ classes.mobileNavItem } label='Home' value='home' icon={ <Icon>home</Icon> } />
                        <BottomNavigationAction className={ classes.mobileNavItem } label='Rooms' value='rooms' icon={ <Icon>dashboard</Icon> } />
                        <BottomNavigationAction className={ classes.mobileNavItem } label='Settings' value='settings' icon={ <Icon>settings</Icon> } />
                    </BottomNavigation>
                }
            </div>
        );
    }
}

MainNavigation.propTypes = {
    classes: PropTypes.object.isRequired,
    //checked: PropTypes.bool.isRequired
};

export default withStyles(styles)(MainNavigation);