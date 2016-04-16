import React from 'react';

export default () => (
  <div className={styles.root}>
    <div className={styles.inner}>
      <div className={styles.title}>Wrong turn?</div>
      <div className={styles.desc}>We can't seem to find the page you're looking for</div>

      <div className={styles.reasonsTitle}>This may have been caused by:</div>
      <ul className={styles.reasons}>
        <li>a mistyped address</li>
        <li>an out-of-date link</li>
      </ul>

      <div className={styles.linksTitle}>Here are helpful links instead:</div>
      <ul className={styles.links}>
      </ul>
    </div>
  </div>
);
