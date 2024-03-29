import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteEvent } from '../../../../../actions/eventsSchedulersAction';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import EventsTable from '../eventsTable/EventsTable';

moment.locale('en-GB');
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class SchedulersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            localizer: BigCalendar.momentLocalizer(moment),
            showStarttime: '',
            showEndTime: '',
            currentEventTitle: '',
            currentEventBody: '',
            currentEventId: '',
            currentLocation: '',
            modal: false
        }
    }

    emptyMessage = () => (
        <p>There is no event in collection</p>
    )

    toggleModal = event => {
        this.setState(prevState => ({
            modal: !prevState.modal,
            showStarttime: event.showStartTime,
            showEndTime: event.showEndTime,
            currentEventTitle: event.title,
            currentEventBody: event.desc,
            currentLocation: event.location,
            currentEventId: event._id
        }));
    };

    eventsList = (events, allViews, deleteEvent) => {
        return (
            <div className="ui container">

                <BigCalendar
                    events={events}
                    localizer={this.state.localizer}
                    views={allViews}
                    step={30}
                    startAccessor='start' 
                    endAccessor='end'
                    timeslots={1}
                    onSelectEvent={this.toggleModal}
                />

                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Title: {this.state.currentEventTitle}</ModalHeader>
                        <ModalBody>
                            Start Date & time:
                            <p>
                                {this.state.showStarttime}
                            </p>
                            End Date & time:
                            <p>
                                {this.state.showEndTime}
                            </p>
                            Location:
                            <p>
                                {this.state.currentLocation}
                            </p>
                            <hr/>
                            Event content: {this.state.currentEventBody}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="info">
                                <Link to={`/admins/events/add-new-event/${this.state.currentEventId}`}>Edit</Link>
                            </Button>
                            <Button color="primary" onClick={() => deleteEvent(this.state.currentEventId)}  >Delete event</Button>
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                </Modal>
                    
            </div>
        )
    }

    render() {
        this.props.events.forEach(event => event.start = moment(event.start).toDate())
        this.props.events.forEach(event => event.end = moment(event.end).toDate())

        return (
            <div className="scheduler-list-page">
                { this.props.events.length === 0 ? 
                    this.emptyMessage() : 
                    this.eventsList(this.props.events, allViews, this.props.deleteEvent)}
            </div>
        )
    }
}

SchedulersList.propTypes = {
    events: PropTypes.array,
    deleteEvent: PropTypes.func
}

const mapStateToProps = (state) => {
    return {
        events: state.events
    }
}

export default connect(mapStateToProps, {
    deleteEvent
})(SchedulersList);