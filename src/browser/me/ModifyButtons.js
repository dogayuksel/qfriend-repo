/* @flow */
import React from 'react';
import { Text, Button, View } from '../app/components';

class ModifyButtons extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object,
    disabled: React.PropTypes.bool,
  };

  modifyValue = (fields: Object, param: string) => {
    const data = ({ ...fields.$values() });
    switch (param) {
      case '0': { fields.$setValue('value', 0); return; }
      case 'x2': { fields.$setValue('value', data.value * 2); return; }
      case '/2': {
        fields.$setValue('value', parseInt(data.value / 2, 10));
        return;
      }
      case '+10': {
        fields.$setValue('value', parseInt(data.value, 10) + 10);
        return;
      }
      case '-10': { fields.$setValue('value', data.value - 10); return; }
      default: return;
    }
  };

  render() {
    const { disabled, fields } = this.props;
    return (
      <View>
        <Button
          mb={3} ml={1} type="button"
          theme="primary"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '0')}
        >
          <Text>0</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          theme="primary"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, 'x2')}
        >
          <Text>x2</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          theme="primary"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '/2')}
        >
          <Text>/2</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          theme="primary"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '+10')}
        >
          <Text>+10</Text>
        </Button>
        <Button
          mb={3} ml={1} type="button"
          theme="primary"
          disabled={disabled}
          onClick={() => this.modifyValue(fields, '-10')}
        >
          <Text>-10</Text>
        </Button>
      </View>
    );
  }
}

export default ModifyButtons;
