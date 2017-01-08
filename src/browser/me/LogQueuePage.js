/* @flow */
import type { State } from '../../common/types';
import * as adminActions from '../../common/admin/actions';
import * as venueActions from '../../common/venues/actions';
import QueueEditView from '../queue/QueueEditView';
import React from 'react';
import ModifyButtons from './ModifyButtons';
import linksMessages from '../../common/app/linksMessages';
import { Flex, Block, Text, Form, Input, FieldError, Button, Title, View } from '../app/components';
import { ValidationError } from '../../common/lib/validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { firebase } from '../../common/lib/redux-firebase';
import { fields } from '../../common/lib/redux-fields';

const styles = {
  valueField: {
    maxWidth: '120px',
    display: 'inline-block',
  },
};

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
      <View>
        <Title message={linksMessages.me} />
        <View>
          <Text>make entries below</Text>
          <Block>
            {venues && venues.map(venue =>
              <View key={venue.key}>
                <Button
                  mb={1}
                  theme="secondary"
                  disabled={disabled}
                  onClick={() => setActiveEntry(venue.key)}
                >
                  <Text>{venue.title}</Text>
                </Button>
                {activeEntry === venue.key &&
                 <Form onSubmit={this.onFormSubmit}>
                   <Flex align="center">
                     <QueueEditView
                       disabled={disabled}
                       venueKey={venue.key}
                     />
                   </Flex>
                   <FieldError error={error} prop="name" />
                   <Input
                     {...fields.value}
                     label="Queue time"
                     style={styles.valueField}
                     aria-invalid={ValidationError.isInvalid(error, 'value')}
                     maxLength={10}
                     type="text"
                   />
                   <Button
                     pill
                     mb={3} ml={2}
                     theme="primary"
                     disabled={disabled}
                     type="submit"
                   >
                     <Text>Submit</Text>
                   </Button>
                   <ModifyButtons fields={fields} disabled={disabled} />
                 </Form>
                }
              </View>
             )
            }
          </Block>
        </View>
      </View>
    );
  }
}

LogQueuePage = fields(LogQueuePage, {
  path: 'queuePage',
  fields: [
    'value',
  ],
  getInitialState: () => ({
    value: '20',
  }),
});

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
