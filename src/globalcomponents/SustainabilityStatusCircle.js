import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// Local import
import { SceneContainer } from '../containers/SceneContainer';
import SustainabilityCards from '../globalcomponents/SustainabilityCards';

const styles = theme => ({
	root: {
		overflow: 'hidden',
	},
    backButton: {
        position: 'absolute',
        top: 12,
        right: 'auto',
        left: 25,
        bottom: 'auto',
		color: 'black',
    },
    subNavBarContainerTab: {
        textAlign: 'center',
        lineHeight: '24px',
        transition: 'font-size 100ms',
		color: theme.palette.primary.main,
        padding: '7px 25px',
        '&:hover': {
            cursor: 'pointer',
        }
    },
});

class SustainabilityStatusCircle extends Component {
	handleOpen = () => {
        if (this.props.sustainabilityStatus.loadingStatus === 'loaded') {
            this.props.updateFullscreenStatus(true);
        }
	};

	handleClose = () => {
        this.props.updateFullscreenStatus(false);
	};

    setActiveTab = (tab) => (event) => { // TODO: check event variable
        this.props.updateSustainabilityStatus(tab);
    };

    render() {
		const { classes, sustainabilityStatus } = this.props;
        const tab = this.props.sustainabilityStatus.selected;
        let circleColorClass = sustainabilityStatus[sustainabilityStatus.selected]['efficiency'];;

        return (
            <div className={ classes.root }>
                <div className={ 'sustainabilityStatusCircleContainer ' + circleColorClass } onClick={ this.handleOpen }>
                    <div className={ 'sustainabilityStatusCircle' }>
                        <SceneContainer view={ this.props.view } />
                    </div>
                </div>

				<div className='sustainabilityStatusCircleFullscreen'>
					{ sustainabilityStatus.fullscreen &&
						<div>
							<div className={ 'bottomContent' }>
								<div className='subNavBarContainerFullscreen'>
									<div className={ classes.subNavBarContainerTab + ' ' + ( tab === 'linq' ? 'subNavBarContainerTabSelected' : '' ) } onClick={ this.setActiveTab('linq') }>
										LINQ
									</div>
									<div className={ classes.subNavBarContainerTab + ' ' + ( tab === 'mylinq' ? 'subNavBarContainerTabSelected' : '' )} onClick={ this.setActiveTab('mylinq') }>
										My LINQ
									</div>
									<div className={ classes.subNavBarContainerTab + ' ' + ( tab === 'district' ? 'subNavBarContainerTabSelected' : '' )} onClick={ this.setActiveTab('district') }>
										District
									</div>
								</div>
								
								<SustainabilityCards />
							</div>

							<IconButton className={ classes.backButton } onClick={ this.handleClose } aria-label='Back'>
								<Icon>arrow_back</Icon>
							</IconButton>
						</div>
					}
				</div>
            </div>
        );
    }
}

SustainabilityStatusCircle.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SustainabilityStatusCircle);
