import { connect } from 'react-redux';
import NotificationsDialog from '../views/NotificationsDialog';

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications,
    }
};

export const NotificationsDialogContainer = connect(
    mapStateToProps,
)(NotificationsDialog);