module walruii_addr::price_feed {
  use std::vector;
  use std::string::{String, utf8};
  use std::timestamp;
  use std::signer;

  struct TokenFeed has store, drop, copy {
    last_price: u64,
    timestamp: u64
  }

  struct PriceFeeds has key, store, drop, copy {
    symbols: vector<String>,
    data: vector<TokenFeed>
  }

  const ENOT_OWNER: u64 = 101;

  fun init_module(owner: &signer) {
    let symbols = vector::empty<String>();
    vector::push_back(&mut symbols, utf8(b"BTC"));
    let new_feed = TokenFeed {
      last_price: 0,
      timestamp: 0
    };
    let data_feed = PriceFeeds {
      symbols: symbols,
      data: (vector[new_feed])
    };
    move_to(owner, data_feed);
  }

  fun update_feed(owner: &signer, last_price: u64, symbol: String)
  acquires PriceFeeds {
    let signer_addr = signer::address_of(owner);
    assert!(signer_addr == @walruii_addr, ENOT_OWNER);
    let time = timestamp::now_seconds();
    let data_store = borrow_global_mut<PriceFeeds>(signer_addr);
    let new_feed = TokenFeed {
      last_price: last_price,
      timestamp: time
    };
    let (result, index) = vector::index_of(&mut data_store.symbols, &symbol);
    if (result == true) {
      vector::remove(&mut data_store.data, index);
      vector::insert(&mut data_store.data, index, new_feed);
    } else {
      vector::push_back(&mut data_store.symbols, symbol);
      vector::push_back(&mut data_store.data, new_feed);
    }
  }

  fun get_token_price(symbol: String): TokenFeed
  acquires PriceFeeds {
    let symbols = borrow_global<PriceFeeds>(@walruii_addr).symbols;
    let (result, index) = vector::index_of(&symbols, &symbol);
    if (result == true) {
      let data_feed = borrow_global<PriceFeeds>(@walruii_addr).data;
      *vector::borrow(&data_feed, index)
    } else {
      return TokenFeed {
        last_price: 0,
        timestamp: 0
      }
    }
  }

  #[test_only]
  use std::debug::print as p;
  #[test(owner = @walruii_addr, init_addr = @0x1)]
  fun test_function(owner: &signer, init_addr: signer) 
  acquires PriceFeeds {
    timestamp::set_time_has_started_for_testing(&init_addr);
    init_module(owner);
    update_feed(owner, 100000, utf8(b"BTC"));
    update_feed(owner, 12342, utf8(b"ETH"));
    update_feed(owner, 1, utf8(b"INDR"));
    let result = get_token_price(utf8(b"BTC"));
    p(&result);
    let result2 = get_token_price(utf8(b"INDR"));
    p(&result2);
    update_feed(owner, 200000, utf8(b"BTC"));
    let result3 = get_token_price(utf8(b"BTC"));
    p(&result3);
  }
}