import { connect } from 'react-redux';
import Scene from '../threejs/Scene';
import { updateSustainabilityStatus, selectAdviceCard, loadingModel } from '../actions';

const mapStateToProps = (state) => {
    return {
        sustainabilityStatus: state.sustainabilityStatus,
    }
};

const mapDispatchToProps = dispatch => ({
    loadingModel: (loadingStatus) => {
        dispatch(loadingModel(loadingStatus));
    },
    updateSustainabilityStatus: (selected) => {
        dispatch(updateSustainabilityStatus(selected));
    },
    selectAdviceCard: (selected) => {
        dispatch(selectAdviceCard(selected));
    }
});

export const SceneContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Scene);