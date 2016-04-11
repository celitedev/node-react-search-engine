import React from 'react';
import PureComponent from 'react-pure-render/component';

import List from 'material-ui/lib/lists/list';
import Subheader from 'material-ui/lib/Subheader/Subheader';
import * as Colors from 'material-ui/lib/styles/colors';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip='more'
    tooltipPosition='bottom-left'
  >
    <MoreVertIcon color={Colors.grey400}/>
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

export default class MyCollections extends PureComponent {

  render() {
    const {collections} = this.props;
    return (
      <List className={styles.root}>
        <Subheader>
          My collections
        </Subheader>

        <Card>
          <CardTitle title='Card title'/>
          <CardMedia className={styles.cardList}>
            {collections.map((c) => (
              <Card key={c.id} className={styles.cardPosition}>
                <div className={styles.cardInfo}>
                  <CardTitle title={c.title} subtitle={c.subtitle}/>
                  <CardText>{c.description}</CardText>
                  <CardActions>
                    <FlatButton label='Action1'/>
                    <FlatButton label='Action2'/>
                  </CardActions>
                </div>
                <div className={styles.cardImage}>
                  <CardMedia>
                    <img src='http://lorempixel.com/600/337/nature/'/>
                  </CardMedia>
                </div>
              </Card>
            ))}
          </CardMedia>
        </Card>
      </List>
    );
  }
}
