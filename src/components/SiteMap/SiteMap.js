import React, {Component} from 'react';
import {pure} from 'recompose';

const SiteMap = pure(() => (
  <div className='sitemap'>
    <div className='sitemap-content'>
      <div className='category'>
        <h5>Happening Now</h5>
        <ul>
          <li><a href='/answer/events today'>Events</a></li>
          <li><a href='/answer/conerts today'>Concerts</a></li>
          <li><a href='/answer/classes today'>Classes</a></li>
          <li><a href='/answer/sportsevent'>Sports</a></li>
          <li><a href='/answer/theaterevent'>Broadway</a></li>
          <li><a href='/answer/fundraisers'>Fundraisers</a></li>
          <li><a href='/answer/party'>Parties</a></li>
          <li><a href='/answer/movie screening'>Movies</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Events</h5>
        <ul>
          <li><a href='/answer/music events'>Music</a></li>
          <li><a href='/answer/Performing Arts events'>Performing Arts</a></li>
          <li><a href='/answer/Sports events'>Sports</a></li>
          <li><a href='/answer/Food events'>Food</a></li>
          <li><a href='/answer/singles events'>Singles</a></li>
          <li><a href='/answer/movie screening'>Movies</a></li>
          <li><a href='/answer/Fundraisers'>Fundraisers</a></li>
          <li><a href='/answer/Conference events'>Conferences</a></li>
          <li><a href='/answer/family_fun_kids'>Family Fun</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Nightlife</h5>
        <ul>
          <li><a href='/answer/bar'>Bars</a></li>
          <li><a href='/answer/local hang out places'>Local Hangouts</a></li>
          <li><a href='/answer/pub places'>Pubs</a></li>
          <li><a href='/answer/lounge places'>Lounges</a></li>
          <li><a href='/answer/wine bar places'>Wine Bars</a></li>
          <li><a href='/answer/hotel places'>Hotel Bars</a></li>
          <li><a href='/answer/Dive bar places'>Dive Bars</a></li>
          <li><a href='/answer/sports bar places'>Sports Bars</a></li>
          <li><a href='/answer/dance club places'>Dance Clubs</a></li>
          <li><a href='/answer/comedy club places'>Comedy Clubs</a></li>
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
          <li><a href='/answer/Museums places'>Museums</a></li>
          <li><a href='/answer/Historic city Sites places'>Historic City Sites</a></li>
          <li><a href='/answer/Parades Festivals places'>Parades & Festivals</a></li>
          <li><a href='/answer/parks places'>Parks</a></li>
          <li><a href='/answer/Art Galleries'>Art Galleries places</a></li>
          <li><a href='/answer/TV Show Tapings places'>TV Show Tapings</a></li>
        </ul>
      </div>

      <div className='category'>
        <h5>Shopping</h5>
        <ul>
          <li><a href='/answer/Clothing Stores places'>Clothing Stores</a></li>
          <li><a href='/answer/Books Magazines & Newspapers Stores places'>Books Magazines & Newspapers Stores</a></li>
          <li><a href='/answer/Shoe Store places'>Shoe Stores</a></li>
          <li><a href='/answer/Depart Stores places'>Department Stores</a></li>
          <li><a href='/answer/Mens Clothing Stores'>Mens Clothing Stores</a></li>
          <li><a href='/answer/Grocery Stores & Supermarke places'>Grocery Stores & Supermarkets</a></li>
          <li><a href='/answer/Womens Clothing Stores places'>Womens Clothing Stores</a></li>
          <li><a href='/answer/Gourmet Food Stores places'>Gourmet Food Stores</a></li>
          <li><a href='/answer/Liquor & Alchol Stores'>Liquor & Alchol Stores</a></li>
          <li><a href='/answer/Antique Stores places'>Antique Stores</a></li>
        </ul>
      </div>
    </div>
  </div>
));

export default SiteMap;
