import React, {PropTypes} from 'react';

const AdSense = ({}) => {
  return (
    <span>
      <script async src='//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'></script>
      <script dangerouslySetInnerHTML={{__html: `
        (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-6571405393522011",
          enable_page_level_ads: true
        });`
      }}/>
    </span>
  );
};

AdSense.propTypes = {

};

export default AdSense;
