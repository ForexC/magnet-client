
/**
 * Dependencies
 */

var debug = require('../../debug')('ListItem');
var ContentSimple = require('./content/simple');
var ContentEmbed = require('./content/embed');
var React = require('react-native');

/**
 * Locals
 */

var {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Component,
  Linking,
  StyleSheet,
  Text,
  View
} = React;

var contentViews = {
  simple: ContentSimple,
  embed: ContentEmbed
};

var containerViews = {
  simple: TouchableOpacity,
  embed: TouchableWithoutFeedback
}

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    debug('created');
  }

  getType() {
    return this.props.embed
      ? 'embed'
      : 'simple'
  }

  render() {
    debug('render');
    var type = this.getType();
    var ContentView = contentViews[type];
    var ContainerView = containerViews[type];

    return (
      <ContainerView onLongPress={this.onLongPress} onPress={this.onPress}>
        <View style={styles.root}>
          <Text
            style={styles.url}
            numberOfLines={1}
          >{this.props.url}</Text>
          <View style={styles.content}>
            <ContentView {...this.props}/>
          </View>
        </View>
      </ContainerView>
    );
  }

  onPress() {
    debug('on press');
    if (this.getType() == 'embed') return;
    Linking.openURL(this.props.url);
  }

  onLongPress() {
    debug('on long press');
    this.props.onLongPress(this);
  }
}

ListItem.propTypes = {
  id: React.PropTypes.number,
  url: React.PropTypes.string,
  embed: React.PropTypes.object,
  onLongPress: React.PropTypes.func
};

/**
 * Exports
 */

module.exports = ListItem;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 14
  },

  url: {
    marginBottom: 7,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#aaa',
    fontSize: 11
  },

  content: {}
});
