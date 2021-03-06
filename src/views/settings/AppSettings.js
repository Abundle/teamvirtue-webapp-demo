import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from 'rc-slider';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { TimePicker, DatePicker } from 'material-ui-pickers';
import Icon from '@material-ui/core/Icon';

// Local import
import { UserDialogContainer } from '../../containers/UserDialogContainer';

const styles = {
    pageTitle: {
        paddingTop: 48,
        paddingBottom: 16,
        textAlign: 'center',
    },
	title: {
		marginBottom: 20,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
};

class ListMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            selectedIndex: 1,
        };
    }

    handleClickListItem = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, anchorEl: null });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <ListItem
                    button
                    aria-haspopup='true'
                    aria-controls='menu'
                    aria-label={ this.props.label }
                    onClick={ this.handleClickListItem }
                >
                    <ListItemIcon>
                        <Icon>{ this.props.icon }</Icon>
                    </ListItemIcon>

                    <ListItemText
                        primary={ this.props.title }
                        secondary={ this.props.options[this.state.selectedIndex] }
                    />
                </ListItem>
                <Menu
                    id='menu'
                    anchorEl={ anchorEl }
                    open={ Boolean(anchorEl) }
                    onClose={ this.handleClose }
                >
                    { this.props.options.map((option, index) => (
                        <MenuItem
                            key={ option }
                            selected={ index === this.state.selectedIndex }
                            onClick={ event => this.handleMenuItemClick(event, index) }
                        >
                            { option }
                        </MenuItem>
                    )) }
                </Menu>
            </div>
        );
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            selectedIndex: 2,
        };
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };
	
    handleBirthdate = date => {
        this.props.updateBirthdate(date);
    };

    handleSleepCycleMode = name => event => {
		this.props.updateSleepCycleMode(event.target.checked);
    };
	
	handleSleepCycleStartTime = (date) => {
		this.props.updateSleepCycleStartTime(date);
    };
	
	handleSleepCycleEndTime = (date) => {
		this.props.updateSleepCycleEndTime(date);
    };

    handleNightMode = (name) => (event) => {
		this.props.updateNightMode(event.target.checked);
    };

    handleNotificationsVolume = name => (newVolume) => {
		this.props.updateNotificationsVolume(newVolume);
    };

    handleNotificationsVibrate = (name) => (event) => {
		this.props.updateNotificationsVibrate(event.target.checked);
    };

    handleNotificationsDesktop = (name) => (event) => {
		this.props.updateNotificationsDesktop(event.target.checked);
    };

    render() {
		const { classes, theme, settings } = this.props;
		
        // const currentUserId = settings.accounts.byId[settings.accounts.currentUser].id;
        const currentUserName = settings.accounts.byId[settings.accounts.currentUser].name;

        return (
            <div className={ 'settings' }>
                <div className='settingsContainer h3-bold'>
                    <Card className={ classes.card }>
                        <CardContent>
                            <List>
                                <Typography variant='subheading' className={classes.title}>Profile</Typography>

                                <UserDialogContainer
                                    // user={{ id: currentUserId, name: currentUser }}
                                    // family={ settings.accounts.byId }
                                    // onSubmit={ (event) => this.handleNameChangeSubmit(event) }
                                />

                                <ListItem>
                                    <ListItemIcon>
                                        <Icon>cake</Icon>
                                    </ListItemIcon>

                                    <ListItemText primary='Birthdate'/>

                                    <DatePicker className='datePicker'
                                                keyboard
                                                format='MMMM Do, YYYY'
                                                value={settings.birthdate}
                                                onChange={this.handleBirthdate}
                                                animateYearScrolling={false}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Icon>timelapse</Icon>
                                    </ListItemIcon>

                                    <ListItemText
                                        primary='Sleep cycle'
                                        secondary='Allows system to automatically adjust light settings'/>

                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={settings.checkedSleepCycleMode}
                                            onChange={this.handleSleepCycleMode()}
                                            value='checkedSleepCycleMode'
                                            color='primary'
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>

                                {settings.checkedSleepCycleMode &&
                                <ListItem>
                                    <ListItemText inset primary='Start'/>
                                    <TimePicker
                                        value={settings.sleepCycleStartTime}
                                        onChange={this.handleSleepCycleStartTime}
                                    />
                                </ListItem>
                                }
                                {settings.checkedSleepCycleMode &&
                                <ListItem>
                                    <ListItemText inset primary='End'/>
                                    <TimePicker
                                        value={settings.sleepCycleEndTime}
                                        onChange={this.handleSleepCycleEndTime}
                                    />
                                </ListItem>
                                }

                                { /* <ListMenu label='Food preferences' title='Food preferences' options={ optionsFood } icon='restaurant'/> */}

                                <ListItem
                                    button
                                    // divider
                                    aria-haspopup='true'
                                    aria-controls='ringtone-menu'
                                    aria-label='Phone ringtone'
                                    // onClick={this.handleClickListItem}
                                >
                                    <ListItemIcon>
                                        <Icon>exit_to_app</Icon>
                                    </ListItemIcon>

                                    <ListItemText primary='Sign out'
                                                  secondary={'Signed in as ' + currentUserName + '. Apartment building 70 LINQ, Dubai'}/>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    { /*
					<Typography variant="subheading" gutterBottom>App Settings</Typography>
					<Card className={classes.card}>
						<CardContent>
							<List>
								<ListItem>
									<ListItemIcon>
										<Icon>brightness_2</Icon>
									</ListItemIcon>

									<ListItemText primary='Night mode' />

									<ListItemSecondaryAction>
										<Switch
											checked={settings.checkedNightMode}
											onChange={this.handleNightMode()}
											color='primary'
										/>
									</ListItemSecondaryAction>
								</ListItem>

								{ settings.checkedNightMode &&
									<ListMenu label='Night mode' title='Turn on automatically' options={ optionsNightmode } />
								}
							</List>
						</CardContent>
					</Card>
					*/}

                    {/*
					<List subheader={ <ListSubheader disableSticky="true">Clock</ListSubheader> }>
						<ListItem>
							<ListItemIcon>
								<Icon>av_timer</Icon>
							</ListItemIcon>

							<div className='listitem-secondaryflex'>
								<ListItemText primary='Clock Budget' />
								<Slider
									min={ 0 }
									defaultValue={ 25 }
									trackStyle={{ backgroundColor: theme.palette.primary.main }}
									dotStyle={{ backgroundColor: 'lightgray', borderColor: 'lightgray' }}
									activeDotStyle={{ backgroundColor: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
									handleStyle={{
										borderColor: theme.palette.primary.main,
										backgroundColor: theme.palette.primary.main,
									}}
									marks = {{
										0: '€1',
										25: '€5',
										50: '€10',
										75: '€15',
										100: '€20',
									}}
									railStyle={{ backgroundColor: 'lightgray' }}
								/>
							</div>

						</ListItem>
					</List>

					<Divider />*/}

                    <Card className={classes.card}>
                        <CardContent>
                            <List>
                                <Typography variant="subheading" className={classes.title}>Notifications</Typography>
                                <ListItem>
                                    <ListItemIcon>
                                        <Icon>volume_up</Icon>
                                    </ListItemIcon>

                                    <div className='listitem-secondaryflex'>
                                        <ListItemText primary='Volume'/>
                                        <Slider
                                            min={0}
                                            max={100}
                                            defaultValue={settings.notificationsVolume}
                                            onChange={this.handleNotificationsVolume()}
                                            trackStyle={{backgroundColor: theme.palette.primary.main}}
                                            handleStyle={{
                                                borderColor: theme.palette.primary.main,
                                                backgroundColor: theme.palette.primary.main,
                                            }}
                                            railStyle={{backgroundColor: 'lightgray'}}
                                        />
                                    </div>

                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Icon>vibration</Icon>
                                    </ListItemIcon>

                                    <ListItemText primary='Vibrate'/>

                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={settings.checkedNotificationsVibrate}
                                            onChange={this.handleNotificationsVibrate()}
                                            color='primary'
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Icon>desktop_windows</Icon>
                                    </ListItemIcon>

                                    <ListItemText primary='Desktop notifications'/>

                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={settings.checkedNotificationsDesktop}
                                            onChange={this.handleNotificationsDesktop()}
                                            color='primary'
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                { /*
								<ListItem
									button
									aria-haspopup='true'
									aria-controls='menu'
									aria-label='Notification types'
									// onClick={this.handleClickListItem}
								>
									<ListItemIcon>
										<Icon>notifications</Icon>
									</ListItemIcon>

									<ListItemText primary='Notifications types' secondary='Choose what you want to be notified of' />
								</ListItem>
								*/}
                            </List>
                        </CardContent>
                    </Card>


                    <Card className={classes.card}>
                        <CardContent>
                            {/*TODO: add licences and dependencies*/}
                            <List>
                                <Typography variant="subheading" className={classes.title}>About</Typography>
                                <ListItem
                                    button
                                    aria-haspopup='true'
                                    aria-controls='ringtone-menu'
                                    aria-label='Phone ringtone'
                                    // onClick={this.handleClickListItem}
                                >
                                    <ListItemText primary='App version' secondary='v1.0.0'/>
                                </ListItem>

                                <ListItem
                                    button
                                    aria-haspopup='true'
                                    aria-controls='ringtone-menu'
                                    aria-label='Phone ringtone'
                                    // onClick={this.handleClickListItem}
                                >
                                    <ListItemText primary='Open-source licences'
                                                  secondary='Licence details for open-source software'/>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

ListMenu.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
};

/*Home.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};*/

export default withTheme()(withStyles(styles)(Settings));