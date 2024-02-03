import resets from '../_resets.module.css';
import classes from './ImageFrame.module.css';
import PropTypes from 'prop-types';

export default function ImageFrame({ img_path }) {
  return (
    <div className={`${resets.storybrainResets} ${classes.root}`}>
      <div className={classes.rectangle1}></div>
          <div className={classes._300pxTeam_blu1} style={{ backgroundImage: 'url("' + img_path + '")' }}></div>
    </div>
  );
}

ImageFrame.propTypes = {
    img_path: PropTypes.string.isRequired
}