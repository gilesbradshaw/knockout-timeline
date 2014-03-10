(function() {
  define([], function() {
    var master_config;

    return master_config = {
      init: function() {
        return this;
      },
      sizes: {
        api: {
          width: 0,
          height: 0
        }
      },
      vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
      api_keys_master: {
        flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
        google: "uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",
        twitter: ""
      },
      timers: {
        api: 7000
      },
      api: {
        pushqueues: []
      }
    }.init();
  });

}).call(this);
