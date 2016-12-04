import React, {Component} from 'react';
import {pure} from 'recompose';

const SiteMap = pure(() => (
  <div className='sitemap'>
    <div className='sitemap-content'>
      <div className='category'>
        <h5>Happening Now</h5>
        <ul>
          <li><a href='/answer/event today'>Events</a></li>
          <li><a href='/answer/concerts today'>Concerts</a></li>
          <li><a href='/answer/course today'>Classes</a></li>
          <li><a href='/answer/sportsevent'>Sports</a></li>
          <li><a href='/answer/theaterevent'>Broadway</a></li>
          <li><a href='/answer/fundraisers'>Fundraisers</a></li>
          <li><a href='/answer/party/Events/today'>Parties</a></li>
          <li><a href='/answer/movie screening'>Movies</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Events</h5>
        <ul>
          <li><a href='/answer/music/Events'>Music</a></li>
          <li><a href='/answer/Performing Arts/Events'>Performing Arts</a></li>
          <li><a href='/answer/Sports/Events'>Sports</a></li>
          <li><a href='/answer/Food/Events'>Food</a></li>
          <li><a href='/answer/singles/Events'>Singles</a></li>
          <li><a href='/answer/movie screening'>Movies</a></li>
          <li><a href='/answer/Fundraisers/Events'>Fundraisers</a></li>
          <li><a href='/answer/Conference/Events'>Conferences</a></li>
          <li><a href='/answer/family_fun_kids/Events'>Family Fun</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Nightlife</h5>
        <ul>
          <li><a href='/answer/bar'>Bars</a></li>
          <li><a href='/answer/local hang out/Places'>Local Hangouts</a></li>
          <li><a href='/answer/pub'>Pubs</a></li>
          <li><a href='/answer/lounge/Places'>Lounges</a></li>
          <li><a href='/answer/wine bar'>Wine Bars</a></li>
          <li><a href='/answer/hotel bar'>Hotel Bars</a></li>
          <li><a href='/answer/Dive bar'>Dive Bars</a></li>
          <li><a href='/answer/sports bar'>Sports Bars</a></li>
          <li><a href='/answer/dance club'>Dance Clubs</a></li>
          <li><a href='/answer/comedy club'>Comedy Clubs</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Restaurants</h5>
        <ul>
          <li><a href='/answer/italian Restaurants'>Italian</a></li>
          <li><a href='/answer/American Restaurants'>American</a></li>
          <li><a href='/answer/Japanese Restaurants'>Japanese</a></li>
          <li><a href='/answer/Mexican Restaurants'>Mexican</a></li>
          <li><a href='/answer/French Restaurants'>French</a></li>
          <li><a href='/answer/Pizza Restaurants'>Pizza</a></li>
          <li><a href='/answer/bakery Restaurants'>Bakeries</a></li>
          <li><a href='/answer/cafe Restaurants'>Cafes</a></li>
          <li><a href='/answer/Chinese Restaurants'>Chinese</a></li>
          <li><a href='/answer/coffee Restaurants'>Coffee & Tea shop</a></li>
          <li><a href='/answer/Indian Restaurants'>Indian/Pakistani</a></li>
          <li><a href='/answer/Burger Restaurants'>Burgers</a></li>
          <li><a href='/answer/Thai Restaurants'>Thai</a></li>
          <li><a href='/answer/Seafood Restaurants'>Seafood</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Tourist Attractions</h5>
        <ul>
          <li><a href='/answer/Museum/Places'>Museums</a></li>
          <li><a href='/answer/Historic City Sites/Places'>Historic City Sites</a></li>
          <li><a href='/answer/Parades Festivals/Places'>Parades & Festivals</a></li>
          <li><a href='/answer/parks/Places'>Parks</a></li>
          <li><a href='/answer/Art Galleries/Places'>Art Galleries</a></li>
          <li><a href='/answer/TV Show Tapings/Places'>TV Show Tapings</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Shopping</h5>
        <ul>
          <li><a href='/answer/Clothing Stores'>Clothing Stores</a></li>
          <li><a href='/answer/Books Magazines Newspapers Stores'>Books Magazines & Newspapers Stores</a></li>
          <li><a href='/answer/Mens Clothing Stores'>Mens Clothing Stores</a></li>
          <li><a href='/answer/Womens Clothing Stores'>Womens Clothing Stores</a></li>
          <li><a href='/answer/Gourmet Food Stores'>Gourmet Food Stores</a></li>
          <li><a href='/answer/Liquor Alcohol stores'>Liquor & Alcohol Stores</a></li>
        </ul>
      </div>
    </div>
  </div>
));

export default SiteMap;
