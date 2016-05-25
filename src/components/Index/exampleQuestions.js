export const types = {
  places: 'PlaceWithOpeninghours',
  happening: 'Event',
  'creative Work': 'CreativeWork',
  'Person / Group': 'OrganizationAndPerson'
};

export default [{
  question: 'show me some restaurants',
  context: {
    'type': 'PlaceWithOpeninghours',
    'wantUnique': false,
    'filter': {
      'subtypes': 'restaurant'
    }
  }
}, {
  question: 'show me some hip-hop',
  context: {
    'type': 'OrganizationAndPerson',
    'wantUnique': false,
    'filter': {
      'tag': 'hip-hop'
    }
  }
}, {
  question: 'all movies (best rated first)',
  context: {
    'type': 'CreativeWork',
    'wantUnique': false,
    'sort': {
      'type': 'field',
      'field': 'aggregateRating.ratingValue',
      'asc': false
    }
  }
}, {
  question: 'popular thrillers (best rated first)',
  context: {
    'type': 'CreativeWork',
    'wantUnique': false,
    'filter': {
      'aggregateRating.ratingCount': {
        'gte': 100
      },
      'genre': 'thriller'
    },
    'sort': {
      'type': 'field',
      'field': 'aggregateRating.ratingValue',
      'asc': false
    }
  }
}, {
  question: 'All movie theaters (closest to Iyan first)',
  context: {
    'type': 'PlaceWithOpeninghours',
    'wantUnique': false,
    'filter': {
      'subtypes': 'movietheater'
    },
    'sort': {
      'type': 'distanceUser'
    },
    'meta': {
      'user': {
        'geo': {
          'lat': 40.7758684,
          'lon': -73.933808
        }
      }
    }
  }
}, {
  question: 'movie showings starting within 6 hours, well rated, near Iyan, sorted by popularity',
  context: {
    'type': 'Event',
    'wantUnique': false,
    'filter': {
      'subtypes': 'ScreeningEvent',
      'workFeatured--expand.aggregateRating.ratingValue': {
        'gte': 4
      }
    },
    'sort': {
      'type': 'field',
      'field': 'aggregateRating.ratingCount',
      'asc': false
    },
    'spatial': {
      'type': 'nearUser',
      'options': {
        'distance': '2mi'
      },
      'path': 'location'
    },
    'temporal': {
      'lte': 'now+6h'
    },
    'meta': {
      'user': {
        'geo': {
          'lat': 40.7758684,
          'lon': -73.933808
        }
      }
    }
  }
}];
