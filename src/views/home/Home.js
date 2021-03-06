import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import FontAwesome from 'react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransitionGroup } from 'react-transition-group';
import '../../animations.css';
import moment from 'moment';

import accountPicture2 from '../../assets/accounts/2.jpg';
import accountPicture3 from '../../assets/accounts/3.jpg';
import accountPicture4 from '../../assets/accounts/4.jpg';
import accountPicture5 from '../../assets/accounts/5.jpg';

const styles = theme => ({
    root: {
        position: 'relative',
        transition: 'all 1s ease-in-out',
        marginBottom: 10,
    },
    subNavBar: {
        zIndex: 20,
    },
    subNavBarIndicator:{
        display: 'none',
    },
    subNavBarContainerTab: {
        color: 'white',
        textAlign: 'center',
        lineHeight: '24px',
        transition: 'font-size 100ms',
        borderBottom: '3px solid transparent',
        padding: '10px 0',
        textTransform: 'none',
        fontWeight: 700,
    },
    iconBox: {
        display: 'table',
        whiteSpace: 'nowrap',
        padding: 0,
    },
    iconBoxPaper: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer',
        display: 'table-cell',
        transition: 'transform 50ms ease-out',
        '&:hover': {
            transform: 'scale(0.85)',
        },
    },
    iconBoxContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    /*iconBoxContentInfo: {
        height: 105,
        width: 105,
        paddingTop: 30,
        marginBottom: 10,
        border: '2px solid #ba491f',
        borderRadius: '50%',
        backgroundColor: '#e46231',
    },*/
    iconBoxContentBadge: {
        top: 10,
        right: 0,
    },
    iconBoxContentBigger: {
        fontSize: 30,
        verticalAlign: 'middle',
        color: 'white',
        marginRight: '-2px',
    },
    iconBoxContentSmaller: {
        fontSize: 16,
    },
    iconCounter: {
        fontSize: 30,
        verticalAlign: 'middle',
        color: 'white',
    },
    iconCounterDescription: {
        display: 'block',
        color: '#ffd1bf',
    },
    dialogRoot: {
        top: 'auto',
        textAlign: 'left',
    },
    dialogPaperRoot: {
        background: 'linear-gradient(90deg, #f9f9f9 50%, #ffffff 50%)',
    },
    dialogContent: {
        display: 'flex',
        alignItems: 'stretch',
    },
    dialogContentHasProgressContainer: {
        paddingBottom: 120,
    },
    dialogLeftColumn: {
        paddingTop: '20px',
        paddingBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    dialogRightColumn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogHeader: {
        backgroundColor: 'white',
        textAlign: 'center',
        textTransform: 'uppercase',
        paddingTop: 20,
        paddingBottom: 10,
        marginBottom: 20,
    },
    dialogHeaderIcon: {
        fontSize: 34,
        verticalAlign: 'middle',
        marginTop: -6,
        marginBottom: 5,
        marginRight: 5,
        color: theme.palette.primary.main,
        display: 'inline-block',
    },
    dialogHeaderHeading: {
        fontWeight: 700,
        display: 'inline-block',
    },
    dialogContentIcon: {
        fontSize: 32,
        verticalAlign: 'middle',
        marginBottom: 7,
        color: theme.palette.primary.main,
    },
    dialogActionContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    dialogAction: {
        margin: '10px 5px',
        transition: 'all 200ms',
        width: 40,
        height: 40,
        color: 'white',
    },
    eatTogetherMessageListItem: {
        backgroundColor: 'white',
        borderRadius: 30,
        marginTop: 10,
        border: '1px solid #e7e7e7',
    },
    eatTogetherNewMessage: {
        borderRadius: 25,
        background: 'white',
        padding: '0 20px',
        marginTop: 10,
        border: '1px solid #dbdbdb',
        flexGrow: 2,
        '& div': {
            padding: '5px 0',
        },
    },
    eatTogetherJoining: {
        color: '#707070',
        fontSize: '90%',
        padding: 0,
        paddingLeft: 10,
    },
    eatTogetherJoiningCancel: {
        color: 'black',
        padding: '20px 0',
        display: 'inline-block',
    },
    avatarSmall: {
        width: 30,
        height: 30,
        marginRight: 10,
        border: '2px solid white',
    },
    center: {
        textAlign: 'center',
    },
    publicTransportDelay: {
        color: 'red',
    },
});

let current_timeout = 0;

function Transition(props) {
    return <Slide direction='up' { ...props } />;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.sustainabilityStatus.selected,
            openDialog: false,
            dialogContent: 'eattogether',
            newMessageInput: '',
        };
    }

    updateActiveTabState = (tab) => {
        if (tab === 0) {
            this.props.updateSustainabilityStatus('linq');
            this.setState({ tab: 'linq' });
        } else if(tab === 1) {
            this.props.updateSustainabilityStatus('mylinq');
            this.setState({ tab: 'mylinq' });
        } else if(tab === 2) {
            this.props.updateSustainabilityStatus('district');
            this.setState({ tab: 'district' });
        }
    };

    handleTabChange = (event, tabIndex) => {
        this.updateActiveTabState(tabIndex);
    };

    handleTabChangeIndex = index => {
        this.updateActiveTabState(index);
    };

    handleDialogOpen = (content) => {
        this.setState({ dialogContent: content });
        this.setState({ openDialog: true });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

    handleNewMessageInput = (e) => {
        this.setState({ newMessageInput: e.target.value });
    };

    handleSubmitEatTogetherStatus = (status, close) => {
        /*** Reset state after a while ***/
        clearTimeout(current_timeout);
        current_timeout = setTimeout(function() { // TODO: Write in ES6
            this.props.updateEatTogetherStatus('requested');
            this.props.resetEatTogetherMessage();
        }.bind(this), 1000 * 45);//45 seconds
        /*********************************/

        this.props.updateEatTogetherStatus(status);
        this.setState({ newMessageInput: '' });

        if (this.state.newMessageInput) {
            this.props.updateEatTogetherMessage(this.state.newMessageInput);
        }
        if (close) {
            this.handleDialogClose();
        }
    };

    renderWashingMachineMessage() {
        let sunrise = moment.unix(this.props.temperature.outside.sunrise);
        let sunset = moment.unix(this.props.temperature.outside.sunset);
        let forecast3h = moment.unix(this.props.temperature.outside.forecast3hDatetime);
        let forecast6h = moment.unix(this.props.temperature.outside.forecast6hDatetime);
        let now = moment();

        let warning = '';
        let positive = '';

        if (now.isSameOrBefore(sunrise, 'hour')) { // if before sunrise hour
            warning = 'Because the sun hasn\'t fully risen yet, you can better wait for a while.';
        } else {
            if (now.isSameOrAfter(sunset, 'hour')) { // if after sunset hour
                warning = 'Because the sun is already set, it is better to wait for tomorrow to do the laundry.';
            } else {
                if (this.props.temperature.outside.description !== 'Clear sky') { //if currently not clear sky
                    if ( this.props.temperature.outside.forecast3hDescription === 'Clear sky' &&
                        forecast3h.isSameOrBefore(sunset, 'hour')
                    ) { //if sun is shining within next forecast time
                        warning = 'You can better wait doing your laundry until ' + moment(forecast3h).format('HH') + 'u. The sky will be clearer and more energy is generated!';
                    } else {
                        if ( this.props.temperature.outside.forecast6hDescription === 'Clear sky' &&
                            forecast6h.isSameOrBefore(sunset, 'hour')
                        ) { //if sun is shining within 2nd forecast time
                            warning = 'You can better wait doing your laundry until ' + moment(forecast6h).format('HH') + 'u. The sky will be clearer and more energy is generated!';
                        } else {
                            positive = 'The solar panels aren\'t generating lots of energy but the forecasts aren\'t any better. It\'s fine to use the washing machine now.';
                        }
                    }
                } else { //everything looks fine now
                    positive = 'The weather is currently sunny enough to use the washing machines efficiently!';
                }
            }
        }

        return (
            <div>
                <div className={ 'notificationPositive' }>
                    There is currently <strong>1</strong> shared washing machine available.
                </div>
                { positive &&
                <div className={ 'notificationPositive' }>
                    { positive }
                </div>
                }
                { warning &&
                <div className={ 'notificationWarning' }>
                    { warning }
                </div>
                }
            </div>
        );
    }

    renderCO2Message() {
        if (this.props.houseData.indoorCO2 >= 0 && this.props.houseData.indoorCO2 < 600) {
            return (
                <div className='notificationPositive'>
                    <strong>The level of CO2 is excellent</strong><br />
                    That's great! Let's keep it under 600ppm.
                </div>
            );
        } else if (this.props.houseData.indoorCO2 >= 600 && this.props.houseData.indoorCO2 < 1000) {
            return (
                <div className='notificationPositive'>
                    <strong>The level of CO2 is good</strong><br />
                    That's good but you might consider to open a window or turn the air conditioning higher. Controlling ventilation is good for your health and it will increase productivity.
                </div>
            );
        } else if (this.props.houseData.indoorCO2 >= 1000 && this.props.houseData.indoorCO2 < 2500) {
            return (
                <div className='notificationWarning'>
                    <strong>The level of CO2 should be improved</strong><br />
                    Elevated levels of CO2 decrease productivity and performance and increase headaches and rates of absenteeism. You must ventilate rooms by turning the air conditioning on or opening a window!
                </div>
            );
        } else if (this.props.houseData.indoorCO2 >= 2500 && this.props.houseData.indoorCO2 < 5000) {
            return (
                <div className='notificationWarning'>
                    <strong>The level of CO2 is bad</strong><br />
                    This might have to do with poorly ventilated rooms or many people in the house. You must ventilate rooms by turning the air conditioning on or opening a window.
                </div>
            );
        } else if (this.props.houseData.indoorCO2 >= 5000) {
            return (
                <div className='notificationWarning'>
                    <strong>The level of CO2 is terribly bad</strong><br />
                    You must <strong>immediately</strong> ventilate rooms by turning the air conditioning on or opening a window!
                </div>
            );
        }
    }

    renderCO2LineProgress() {
        if (this.props.houseData.indoorCO2 >= 0 && this.props.houseData.indoorCO2 < 600) {
            return '12.5%';
        } else if (this.props.houseData.indoorCO2 >= 600 && this.props.houseData.indoorCO2 < 1000) {
            return '37.5%';
        } else if (this.props.houseData.indoorCO2 >= 1000 && this.props.houseData.indoorCO2 < 2500) {
            return '62.5%';
        } else if (this.props.houseData.indoorCO2 >= 2500 && this.props.houseData.indoorCO2 < 5000) {
            return '87.5%';
        } else if (this.props.houseData.indoorCO2 >= 5000) {
            return '100%';
        }
    }

    renderHumidityMessage(){
        if (this.props.houseData.indoorHumidity >= 0 && this.props.houseData.indoorHumidity < 35) {
            return (
                <div className='notificationWarning'>
                    <strong>The level of humidity is too low</strong><br />
                    Although it feels comfortable, this level of humidity is too low! Consider buying a humidifier.
                </div>
            );
        } else if (this.props.houseData.indoorHumidity >= 35 && this.props.houseData.indoorHumidity <= 50) {
            return (
                <div className='notificationPositive'>
                    <strong>The level of humidity is excellent</strong><br />
                    That's great! Let's keep it between 35% and 50%.
                </div>
            );
        } else if (this.props.houseData.indoorHumidity > 50) {
            return (
                <div className='notificationWarning'>
                    <strong>The level of humidity is too high</strong><br />
                    You might consider opening a door. Also, make sure to close the door when you are taking a shower.
                </div>
            );
        }
    }

    renderTemperatureMessage() {
        if (
            this.props.houseData.indoorTemperature <= 23 &&
            this.props.houseData.room['All Rooms'].airco.onOff === true &&
            this.props.houseData.room['All Rooms'].airco.temperature <= 23
        ) {
            return (
                <div className='notificationWarning'>
                    It is recommended to set your AC to 24°C.
                </div>
            );
        } else if (
            this.props.houseData.indoorTemperature <= 23 &&
            this.props.houseData.room['All Rooms'].airco.onOff === true &&
            this.props.houseData.room['All Rooms'].airco.temperature >= 24
        ) {
            return (
                <div className='notificationPositive'>
                    It is currently { this.props.houseData.indoorTemperature }°C.
                    You already set the AC to 24°C.
                    The temperature in the room will be adjusted soon.
                </div>
            );
        } else {
            return (
                <div className='notificationPositive'>
                    The HVAC is a huge energy consumer. It is currently disabled.
                    If you do not feel comfortable you might consider turning it on.
                    It is recommended to set your AC to 24°C.
                </div>
            );
        }
    }



    render() {
        const { classes, temperature, houseData } = this.props;
        const tab = this.state.tab;

        return (
            <div className={ classes.root }>
                <div className='subNavBarContainer'>
                    <Tabs
                        value={ (this.props.sustainabilityStatus.selected === 'linq') ? (0) : ((this.props.sustainabilityStatus.selected === 'mylinq') ? (1) : (2)) }
                        onChange={ this.handleTabChange }
                        classes={{ root: classes.subNavBar, indicator: classes.subNavBarIndicator }}
                        indicatorColor='secondary'
                        textColor='secondary'
                        centered
                        fullWidth
                    >
                        <Tab
                            label={( houseData.eatTogetherStatus === 'requested' && tab!=='linq') ? (
                                <Badge badgeContent='1' color='secondary' style={{ padding: '0 10px' }} classes={{ badge: 'badge' }}>
                                    LINQ
                                </Badge>
                            ) : (
                                'LINQ'
                            )}
                            classes={{ label: classes.subNavBarContainerTab, selected: 'subNavBarContainerTabSelected' }} />
                        <Tab label='MY LINQ' classes={{ label: classes.subNavBarContainerTab, selected: 'subNavBarContainerTabSelected' }} />
                        <Tab label='DISTRICT' classes={{ label: classes.subNavBarContainerTab, selected: 'subNavBarContainerTabSelected' }} />
                    </Tabs>

                    <SwipeableViews
                        index={ (this.props.sustainabilityStatus.selected === 'linq') ? (0) : ((this.props.sustainabilityStatus.selected === 'mylinq') ? (1) : (2)) }
                        onChangeIndex={ this.handleTabChangeIndex }
                    >

                        <div className='row no-margin'>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('bikes') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>directions_bike</Icon>
											<span className={ classes.iconBoxContentBigger }> 5</span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Available bikes</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('solarcar') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<FontAwesome className={ classes.iconBoxContentBigger } name='car' />
											<span className={ classes.iconBoxContentBigger }> 1</span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Available solar car</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('washingmachine') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>local_laundry_service</Icon>
											<span className={ classes.iconBoxContentBigger }> 1</span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Available machine</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('eattogether') }
                                >
                                    <div className={ classes.iconBoxContent }>
                                        { houseData.eatTogetherStatus === 'requested' ? (
                                            <div>
                                                <Badge badgeContent='1' classes={{ badge: classes.iconBoxContentBadge }} color='secondary'>
													<span className={ 'iconBoxContentInfo' }>
														<Icon className={ classes.iconBoxContentBigger }>restaurant</Icon>
														<span className={ classes.iconBoxContentBigger }> 2</span>
													</span>
                                                </Badge>
                                                <span className={ classes.iconCounterDescription }>Eat together</span>
                                            </div>
                                        ) : (
                                            <div>
												<span className={ 'iconBoxContentInfo' }>
													<Icon className={ classes.iconBoxContentBigger }>restaurant</Icon>
													<span className={ classes.iconBoxContentBigger }> { (houseData.eatTogetherStatus === 'yes' ? 3 : 2 ) }</span>
												</span>
                                                <span className={ classes.iconCounterDescription }>Eat together</span>
                                            </div>
                                        ) }
                                    </div>
                                </Paper>
                            </div>
                        </div>

                        <div className='row no-margin'>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('temperatureindoor') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<FontAwesome className={ classes.iconBoxContentBigger } name='thermometer-half' />
											<span className={ classes.iconBoxContentBigger }> { Math.round(houseData.indoorTemperature) }<span className={ classes.iconBoxContentSmaller }>°C</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Temperature</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('humidity') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<FontAwesome className={ classes.iconBoxContentBigger } name='tint' />
											<span className={ classes.iconBoxContentBigger }> { houseData.indoorHumidity }<span className={ classes.iconBoxContentSmaller }>%</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Humidity</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('CO2') }
                                >
                                    <div className={ classes.iconBoxContent }>
                                        <span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>cloud</Icon>
											<span className={ classes.iconBoxContentBigger } style={{ fontSize: 24, lineHeight: '1.9em' }}> { houseData.indoorCO2 }</span>
										</span>
                                        { houseData.indoorCO2 < 1000 ?
                                            <span className={ classes.iconCounterDescription }>Healthy CO2</span>
                                            :
                                            <span className={ classes.iconCounterDescription }><strong>Unhealthy CO2</strong></span>
                                        }
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('energyusage') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>power</Icon>
											<span className={ classes.iconBoxContentBigger }>5</span>
										</span>
                                        <span className={ classes.iconCounterDescription }>kWh energy</span>
                                    </div>
                                </Paper>
                            </div>
                        </div>

                        <div className='row no-margin'>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('temperatureoutside') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<FontAwesome className={ classes.iconBoxContentBigger } name='thermometer-half' />
											<span className={ classes.iconBoxContentBigger }> { temperature.outside.celsius }<span className={ classes.iconBoxContentSmaller }>°C</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>{ temperature.outside.description }</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('publictransport') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>directions_bus</Icon>
											<span className={ classes.iconBoxContentBigger }> 7<span className={ classes.iconBoxContentSmaller }>m</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Next bus</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('publictransport') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>directions_subway</Icon>
											<span className={ classes.iconBoxContentBigger }> 9<span className={ classes.iconBoxContentSmaller }>m</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Next metro</span>
                                    </div>
                                </Paper>
                            </div>
                            <div className={ classes.iconBox + ' col-3' }>
                                <Paper
                                    className={ classes.iconBoxPaper }
                                    elevation={ 1 }
                                    square={ true }
                                    onClick={ () => this.handleDialogOpen('publictransport') }
                                >
                                    <div className={ classes.iconBoxContent }>
										<span className={ 'iconBoxContentInfo' }>
											<Icon className={ classes.iconBoxContentBigger }>tram</Icon>
											<span className={ classes.iconBoxContentBigger }> 9<span className={ classes.iconBoxContentSmaller }>m</span></span>
										</span>
                                        <span className={ classes.iconCounterDescription }>Next tram</span>
                                    </div>
                                </Paper>
                            </div>
                        </div>

                    </SwipeableViews>
                </div>

                <Dialog
                    open={this.state.openDialog}
                    TransitionComponent={Transition}
                    onClose={this.handleDialogClose}
                    classes={{
                        root: classes.dialogRoot,
                        paper: classes.dialogPaperRoot,
                    }}
                    fullWidth
                >

                { this.state.dialogContent === 'bikes' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <Icon className={ classes.dialogHeaderIcon }>directions_bike</Icon>
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Bike Shed
                        </Typography>
                        Biking is fast, cheap, reduces stress and anxiety, improves sleep patterns, and is better for the environment!
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        <div className='notificationPositive'>
                            There are <strong>5</strong> bikes available in the shared bike shed.
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'solarcar' &&
                <DialogContent className={'row no-margin ' + classes.dialogContent}>
                    <div className={'col-6 ' + classes.dialogLeftColumn}>
                        <FontAwesome className={ classes.dialogHeaderIcon } name='car' /><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Garage
                        </Typography>
                        Using a solar-powered car is fast, cheap and much better for the environment!
                    </div>
                    <div className={'col-6 ' + classes.dialogRightColumn}>
                        <div className='notificationPositive'>
                            There is currently <strong>1</strong> solar car available in the shared garage.
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'washingmachine' &&
                <DialogContent className={'row no-margin ' + classes.dialogContent}>
                    <div className={'col-6 ' + classes.dialogLeftColumn}>
                        <Icon className={ classes.dialogHeaderIcon }>local_laundry_service</Icon><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Laundry Room
                        </Typography>
                        Using the shared washing machines during sunlight hours is very energy efficient and it prevents extreme peak hours.
                    </div>
                    <div className={'col-6 ' + classes.dialogRightColumn}>
                        { this.renderWashingMachineMessage() }
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'eattogether' &&
                <DialogContent style={{backgroundColor: '#f9f9f9',}}>
                    <List>
                        <ListItem className={classes.eatTogetherMessageListItem}>
                            <Avatar alt='Abdul' src={accountPicture3} />
                            <ListItemText
                                primary='Hellooo! Would someone like to cook and eat together tonight?'
                                secondary='Abdul, 1 hour ago' />
                        </ListItem>
                        <ListItem className={classes.eatTogetherMessageListItem}>
                            <Avatar alt='Jamil' src={accountPicture4} />
                            <ListItemText
                                primary='Cool, I&#39;m in! I can help around 19h?'
                                secondary='Mar, 45 minutes ago' />
                        </ListItem>
                        <CSSTransitionGroup
                            transitionName='messageAnimation'
                            transitionAppear={ true }
                            transitionAppearTimeout={ 500 }
                            transitionEnterTimeout={ 350 }
                            transitionLeaveTimeout={ 350 }
                        >
                            { houseData.eatTogetherMessage.map((message) => {
                            // { houseData.eatTogetherMessage.map((message, i) => {
                                    return (
                                        <ListItem className={ classes.eatTogetherMessageListItem }>
                                            <Avatar alt='You' src={ accountPicture2 } />
                                            <ListItemText
                                                primary={ message }
                                                secondary='You, just now' />
                                        </ListItem>
                                    );
                                }
                            ) }
                        </CSSTransitionGroup>
                    </List>

                    { houseData.eatTogetherStatus === 'yes' ? (
                        <List>
                            <ListItem dense className={ classes.eatTogetherJoining + ' notificationPositive' }>
                                <Avatar alt='Mohamed' src={ accountPicture4 } className={ classes.avatarSmall } />
                                <Avatar alt='Ana' src={ accountPicture5 } className={ classes.avatarSmall } style={{ marginLeft: '-28px' }} />
                                <Avatar alt='You' src={ accountPicture2 } className={ classes.avatarSmall } style={{ marginLeft: '-28px' }} />
                                <span>
                                        <em>Ana, Mohammed and you are joining. </em>
                                        {/*eslint-disable no-script-url*/}
                                        <a href='javascript:void(0)'
                                           className={ classes.eatTogetherJoiningCancel }
                                           onClick={ () => {
                                               this.handleSubmitEatTogetherStatus('requested', false)
                                           }}>
                                            <em>Cancel</em>
                                        </a>
                                    </span>
                            </ListItem>
                        </List>
                    ) : (
                        <List>
                            <ListItem dense className={ classes.eatTogetherJoining + (houseData.eatTogetherStatus === 'no' ? ' notificationNegative' : '')}>
                                <Avatar alt='Mohamed' src={ accountPicture4 } className={ classes.avatarSmall } />
                                <Avatar alt='Ana' src={ accountPicture5 } className={ classes.avatarSmall } style={{ marginLeft: '-28px' }} />
                                {houseData.eatTogetherStatus === 'no' ? (
                                    <span>
                                            <em>Ana and Mohammed are joining. You are not. </em>
                                            <a href='javascript:void(0)' className={classes.eatTogetherJoiningCancel} onClick={ () => this.handleSubmitEatTogetherStatus('requested', false) }><em>Cancel</em></a>
                                        </span>
                                ) : (
                                    <span><em>Ana and Mohammed are joining.</em></span>
                                )}
                            </ListItem>
                        </List>
                    )}

                    <div className={ classes.dialogActionContainer }>
                        <TextField
                            id='filled-dense'
                            placeholder='Message'
                            className={ classes.eatTogetherNewMessage }
                            margin='normal'
                            variant='filled'
                            InputProps={{
                                disableUnderline: true
                            }}
                            onChange={ this.handleNewMessageInput }
                            value={ this.state.newMessageInput }
                            ref={ el => this.input = el }
                        />
                        { houseData.eatTogetherStatus === 'requested' ? (
                            <div>
                                <IconButton className={ classes.dialogAction } style={{ backgroundColor: '#03cea4' }} onClick={ () => this.handleSubmitEatTogetherStatus('yes', false) }>
                                    <Icon>thumb_up_alt</Icon>
                                </IconButton>
                                <IconButton className={ classes.dialogAction } style={{ backgroundColor: '#e9190f' }} onClick={ () => this.handleSubmitEatTogetherStatus('no', false) }>
                                    <Icon>thumb_down_alt</Icon>
                                </IconButton>
                            </div>
                        ) : (
                            <div>
                                <IconButton className={ classes.dialogAction } style={{ backgroundColor: '#bcbcbc' }} onClick={ () => this.handleSubmitEatTogetherStatus('yes', false) }>
                                    <Icon>mode_comment</Icon>
                                </IconButton>
                            </div>
                        ) }
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'temperatureindoor' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <FontAwesome className={ classes.dialogHeaderIcon } name='thermometer-half' /><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Temperature ({ this.props.houseData.indoorTemperature }°C)
                        </Typography>
                        Did you know that each extra degree can mean up to 9% savings on cooling costs?
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        { this.renderTemperatureMessage() }
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'humidity' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent + ' ' + classes.dialogContentHasProgressContainer }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <FontAwesome className={ classes.dialogHeaderIcon } name='tint' /><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Humidity ({ this.props.houseData.indoorHumidity }%)
                        </Typography>
                        A good level of humidity is better for your health and for the condition of materials in the house.
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        { this.renderHumidityMessage() }
                    </div>

                    <div className='ProgressContainer'>
                        <div className='ProgressLine'>
                            <div className='dot'>
                                Very low
                                <span>10%</span>
                            </div>
                            <div className='dot'>
                                Low
                                <span>30%</span>
                            </div>
                            <div className='dot'>
                                Excellent
                                <span>50%</span>
                            </div>
                            <div className='dot'>
                                High
                                <span>70%</span>
                            </div>
                            <div className='dot'>
                                Very high
                                <span>90%</span>
                            </div>
                        </div>
                        <div className='line'>
                            <div className='lineFill' style={{ width: houseData.indoorHumidity + '%' }} />
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'CO2' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent + ' ' + classes.dialogContentHasProgressContainer }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <Icon color='primary' className={ classes.dialogHeaderIcon }>cloud</Icon><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            CO2 ({ this.props.houseData.indoorCO2 } ppm)
                        </Typography>
                        Controlling ventilation is good for your health and increases productivity.
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        { this.renderCO2Message() }
                    </div>

                    <div className='ProgressContainer'>
                        <div className='ProgressLine'>
                            <div className='dot'>
                                Excellent
                                <span>0-600</span>
                            </div>
                            <div className='dot'>
                                Good
                                <span>600-1,000</span>
                            </div>
                            <div className='dot'>
                                Medium
                                <span>1,000-2,500</span>
                            </div>
                            <div className='dot'>
                                Bad
                                <span>2,500 and higher</span>
                            </div>
                        </div>
                        <div className='line'>
                            <div className='lineFill' style={{ width: this.renderCO2LineProgress() }} />
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'energyusage' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <Icon className={ classes.dialogHeaderIcon }>power</Icon><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Energy usage ({ houseData.room['All Rooms'].energyUsageRealtime } kW)
                        </Typography>
                        A smart way to use solar energy wisely is to run energy-hungry appliances, such as the dishwasher, washing machine and dryer, during sunny hours.
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        <div className={ 'notificationPositive' }>
                            Everything looks fine
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'temperatureoutside' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <FontAwesome className={ classes.dialogHeaderIcon } name='thermometer-half' /><br />
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Temperature
                        </Typography>
                        <span>
                                It is currently <strong>{ temperature.outside.celsius }°C</strong> outside ({ temperature.outside.description.toLowerCase() }).
                                The sun goes down at { moment.unix(temperature.outside.sunset).format('HH:mm') } and rises at { moment.unix(temperature.outside.sunrise).format('HH:mm') }.
                            </span>
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        <div className={ classes.center }>
                            <FontAwesome className={ classes.dialogContentIcon } name='cloud' /><br />
                            <strong>Forecast</strong><br />
                            { moment.unix(temperature.outside.forecast3hDatetime).format('HH:mm') }: { temperature.outside.forecast3hDescription } ({ temperature.outside.forecast3hCelsius }°C)
                            <br />
                            { moment.unix(temperature.outside.forecast6hDatetime).format('HH:mm') }: { temperature.outside.forecast6hDescription } ({ temperature.outside.forecast6hCelsius }°C)
                        </div>
                    </div>
                </DialogContent>
                }

                { this.state.dialogContent === 'publictransport' &&
                <DialogContent className={ 'row no-margin ' + classes.dialogContent }>
                    <div className={ 'col-6 ' + classes.dialogLeftColumn }>
                        <Typography className={ classes.dialogHeaderHeading } variant='title' gutterBottom>
                            Public transport
                        </Typography>
                        Using public transport brings more security, convenience, efficiency, money-saving, and physical fitness.
                    </div>
                    <div className={ 'col-6 ' + classes.dialogRightColumn }>
                        <div className={ 'row ' + classes.center }>
                            <div className='col-4'>
                                <Icon className={ classes.dialogContentIcon }>directions_bus</Icon>
                                <br />
                                <strong>Bus</strong>
                                <br />
                                7m<br />
                                12m<br />
                                18m<br />
                            </div>
                            <div className='col-4'>
                                <Icon className={ classes.dialogContentIcon }>directions_subway</Icon>
                                <br />
                                <strong>Metro</strong>
                                <br />
                                9m<br />
                                14m<br />
                                19m<br />
                            </div>
                            <div className='col-4'>
                                <Icon className={ classes.dialogContentIcon }>tram</Icon>
                                <br />
                                <strong>Tram</strong>
                                <br />
                                9m<br />
                                17m<br />
                                29m <span className={ classes.publicTransportDelay }>(+3)</span><br />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                }
                </Dialog>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withTheme()(withStyles(styles)(Home));