modules.define(
    'spec',
    ['feed', 'i-bem__dom'],
    function (provide, Feed, BEMDOM) {

        describe('feed', function () {
            var feed;
            var feedDomElem;
            var feedParentDomElem;

            beforeEach(function () {
                feedParentDomElem = $(BEMHTML.apply({ tag : 'div' })).appendTo('body');
                feed = buildFeed(
                    feedParentDomElem,
                    {
                        block : 'feed',
                        zIndexGroupLevel : 2,
                        content : 'content'
                    });
                feedDomElem = feed.domElem;
            });

            afterEach(function () {
                BEMDOM.destruct(feedParentDomElem);
            });

            describe('check correct html', function () {
                it('Feed html should be correct', function () {
                    feed.renderHtml().should.be.eql('5');
                    BEMDOM.destruct(feedDomElem);
                });
            });
        });

        provide();

        function buildFeed(parentDomElem, bemjson) {
            return BEMDOM.init($(BEMHTML.apply(bemjson)).appendTo(parentDomElem))
                .bem('feed');
        }

    });
