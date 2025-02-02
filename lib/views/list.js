'use strict';

/**
 * Dependencies
 */

var ContextMenuView = require('./context-menu');
var debug = require('../debug')('List');
var ListItem = require('./list-item');
var React = require('react-native');
var Scanner = require('../scanner');

var {
  Component,
  StyleSheet,
  ScrollView,
  View,
  Linking
} = React;

class List extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      items: [],
      contextMenu: null
    };

    this.onItemLongPress = this.onItemLongPress.bind(this);
    this.scanner = new Scanner(this.onItemFound.bind(this));

    // Finding something before react-native is
    // fully initialized can cause a crash:
    // https://github.com/walmartreact/react-native-orientation-listener/issues/8
    // TODO: This should be fixed inside NetworkScanner.java
    setTimeout(() => this.scanner.start(), 1000);
  }

  onItemFound(item) {
    this.addItem(item);
  }

  addItem(item) {
    debug('add item', item);
    var items = this.state.items.concat([item]);
    this.setState({ items: items });
  }

  render() {
    debug('render');

    var ContextMenu;
    var items = this.state.items.map(item => {
      return <ListItem
        {...item}
        onLongPress={this.onItemLongPress}
        key={item.id}
      />
    });

    if (this.state.contextMenu) {
      ContextMenu = <ContextMenuView
        items={this.state.contextMenu.items}
        onClosed={this.onContextMenuClosed.bind(this)}
        />
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>{items}</View>
        </ScrollView>
        {ContextMenu}
      </View>
    );
  }

  onItemLongPress(item) {
    this.showItemContextMenu(item);
  }

  showItemContextMenu(item) {
    this.setState({
      contextMenu: {
        items: [
          {
            text: 'Visit Link',
            callback: () => Linking.openURL(item.props.url)
          },

          {
            text: 'Reload',
            callback: () => {} // needs implementing
          },

          {
            text: 'Hide',
            callback: () => {} // needs implementing
          }
        ]
      }
    });
  }

  onContextMenuClosed() {
    this.setState({ contextMenu: null });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },

  content: {
    padding: 14
  }
});

/**
 * Exports
 */

module.exports = List;
