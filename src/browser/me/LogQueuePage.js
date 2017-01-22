/* @flow */
import type { State } from '../../common/types';
import * as adminActions from '../../common/admin/actions';
import * as venueActions from '../../common/venues/actions';
import QueueEditView from '../queue/QueueEditView';
import React from 'react';
import ModifyButtons from './ModifyButtons';
import linksMessages from '../../common/app/linksMessages';
import { Text, Form, Input, Button, Title, Box } from '../app/components';
import { ValidationError } from '../../common/lib/validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { firebase } from '../../common/lib/redux-firebase';
import { fields } from '../../common/lib/redux-fields';

type LocalState = {
  disabled: boolean,
  error: ?Object,
  submittedValues: ?Object,
};

class LogQueuePage extends React.Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    venues: React.PropTypes.array,
    queues: React.PropTypes.object,
    viewer: React.PropTypes.object.isRequired,
    activeEntry: React.PropTypes.node,
    adminActions: React.PropTypes.object.isRequired,
  };

  state: LocalState = {
    disabled: false,
    error: null,
    submittedValues: null,
  };

  onFormSubmit = () => {
    const { fields,
            activeEntry,
            viewer,
            adminActions: { addQueueEntry },
    } = this.props;

    const queueData = ({ ...fields.$values() });
    // Disable form.
    this.setState({ disabled: true });
    let isValid = false;
    if (typeof queueData.value === 'number') {
      isValid = queueData;
    } else if (typeof queueData.value === 'string') {
      isValid = parseInt(queueData.value.trim(), 10);
    }
    if (!isValid) {
      this.setState({ disabled: false });
      const error = new ValidationError('required', { prop: 'value' });
      this.setState({ error, submittedValues: null });
      return;
    }

    addQueueEntry(activeEntry, queueData, viewer);
    setTimeout(() => {
      this.setState({ disabled: false });
      this.setState({ error: null, submittedValues: queueData });
      fields.$reset();
    }, 750);
  }

  render() {
    const { venues, queues, activeEntry, fields } = this.props;
    const { adminActions: { setActiveEntry, deleteQueueEntry } } = this.props;
    const { disabled, error } = this.state;

    return (
      <Box>
        <Title message={linksMessages.me} />
        <Box margin={1}>
          <Text>make entries below</Text>
          <Box>
            {venues && venues.map(venue =>
              <Box key={venue.key}>
                <Button
                  warning
                  disabled={disabled}
                  onClick={() => setActiveEntry(venue.key)}
                >
                  {venue.title}
                </Button>
                {activeEntry === venue.key &&
                 <Form onSubmit={this.onFormSubmit}>
                   <Box>
                     <QueueEditView
                       disabled={disabled}
                       venueKey={venue.key}
                     />
                   </Box>
                   <Box display="flex" alignItems="center">
                     <Input
                       marginRight={1}
                       {...fields.value}
                       label="Queue time"
                       maxLength={10}
                       type="text"
                     />
                     <Button
                       onClick={this.onFormSubmit}
                       primary
                       disabled={disabled}
                     >
                       Submit
                     </Button>
                   </Box>
                   <ModifyButtons fields={fields} disabled={disabled} />
                 </Form>
                }
              </Box>
             )
            }
          </Box>
        </Box>
      </Box>
    );
  }
}

LogQueuePage = fields({
  path: 'queuePage',
  fields: [
    'value',
  ],
  getInitialState: () => ({
    value: '20',
  }),
})(LogQueuePage);

LogQueuePage = firebase((database, props) => {
  const locationsLogRef = database.child('locations');
  return [
    [locationsLogRef, 'on', 'value', props.venueActions.listVenues],
  ];
})(LogQueuePage);

const mapDispatchToProps = (dispatch) => {
  return {
    venueActions: bindActionCreators(venueActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch),
  };
}

export default connect((state: State) => {
  return {
    viewer: state.users.viewer,
    venues: state.venues.venueList,
    queues: state.queues.queueMap,
    activeEntry: state.admin.activeEntry,
  };
}, mapDispatchToProps)(LogQueuePage);
