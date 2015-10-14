var vow = require('vow');

var emojiRegExp = /:(\w{2,30}):/gim;

var createImageUrl = function(emoji){
    if(!emoji.length) {
        return '';
    }

    return '<img width="24" height="24" src="https://cdn.jsdelivr.net/emojione/assets/png/'+
        emojiData[emoji].unicode + '.png" alt=""/>';
};

var emojiData = {
    '100' : {
        'unicode' : '1F4AF',
        'shortname' : ':100:',
        'aliases' : '',
        'keywords' : 'hundred points symbol numbers perfect score 100 percent a plus perfect school quiz score test '
    },
    '1234' : {
        'unicode' : '1F522',
        'shortname' : ':1234:',
        'aliases' : '',
        'keywords' : 'input symbol for numbers blue-square numbers'
    },
    'hearts' : {
        'unicode' : '2665',
        'shortname' : ':hearts:',
        'aliases' : '',
        'keywords' : 'black heart suit cards poker'
    },
    'joy' : {
        'unicode' : '1F602',
        'shortname' : ':joy:',
        'aliases' : '',
        'keywords' : 'face with tears of joy cry face haha happy tears tears cry joy happy weep'
    },
    'unamused' : {
        'unicode' : '1F612',
        'shortname' : ':unamused:',
        'aliases' : '',
        'keywords' : 'unamused face bored face indifference serious straight face unamused not amused depressed '
    },
    'heart_eyes' : {
        'unicode' : '1F60D',
        'shortname' : ':heart_eyes:',
        'aliases' : '',
        'keywords' : 'smiling face with heart-shaped eyes affection crush face infatuation like love valentines smiling'
    },
    'heart' : {
        'unicode' : '2764',
        'shortname' : ':heart:',
        'aliases' : '',
        'keywords' : 'heavy black heart like love red pink black heart love passion romance intense desire death   '
    },
    'relaxed' : {
        'unicode' : '263A',
        'shortname' : ':relaxed:',
        'aliases' : '',
        'keywords' : 'white smiling face blush face happiness massage smile'
    },
    'ok_hand' : {
        'unicode' : '1F44C',
        'shortname' : ':ok_hand:',
        'aliases' : '',
        'keywords' : 'ok hand sign fingers limbs perfect okay ok smoke smoking marijuana joint pot 420'
    },
    'kissing_heart' : {
        'unicode' : '1F618',
        'shortname' : ':kissing_heart:',
        'aliases' : '',
        'keywords' : 'face throwing a kiss affection face infatuation kiss blowing kiss heart love lips like love '
    },
    'blush' : {
        'unicode' : '1F60A',
        'shortname' : ':blush:',
        'aliases' : '',
        'keywords' : 'smiling face with smiling eyes crush embarrassed face flushed happy shy smile smiling smile '
    },
    'weary' : {
        'unicode' : '1F629',
        'shortname' : ':weary:',
        'aliases' : '',
        'keywords' : 'weary face face frustrated sad sleepy tired weary sleepy tired tiredness study finals school '
    },
    'pensive' : {
        'unicode' : '1F614',
        'shortname' : ':pensive:',
        'aliases' : '',
        'keywords' : 'pensive face face okay sad pensive thoughtful think reflective wistful meditate serious'
    },
    'sob' : {
        'unicode' : '1F62D',
        'shortname' : ':sob:',
        'aliases' : '',
        'keywords' : 'loudly crying face cry face sad tears upset cry sob tears sad melancholy morn somber hurt'
    },
    'smirk' : {
        'unicode' : '1F60F',
        'shortname' : ':smirk:',
        'aliases' : '',
        'keywords' : 'smirking face mean prank smile smug smirking smirk smug smile half-smile conceited'
    },
    'two_hearts' : {
        'unicode' : '1F495',
        'shortname' : ':two_hearts:',
        'aliases' : '',
        'keywords' : 'two hearts affection like love valentines heart hearts two love emotion'
    },
    'grin' : {
        'unicode' : '1F601',
        'shortname' : ':grin:',
        'aliases' : '',
        'keywords' : 'grinning face with smiling eyes face happy joy smile grin grinning smiling smile smiley'
    },
    'flushed' : {
        'unicode' : '1F633',
        'shortname' : ':flushed:',
        'aliases' : '',
        'keywords' : 'flushed face blush face flattered flush blush red pink cheeks shy'
    },
    'thumbsup' : {
        'unicode' : '1F44D',
        'shortname' : ':thumbsup:',
        'aliases' : ':+1:',
        'keywords' : 'thumbs up sign cool hand like yes'
    },
    'raised_hands' : {
        'unicode' : '1F64C',
        'shortname' : ':raised_hands:',
        'aliases' : '',
        'keywords' : 'person raising both hands in celebration gesture hooray winning woot yay banzai'
    },
    'wink' : {
        'unicode' : '1F609',
        'shortname' : ':wink:',
        'aliases' : '',
        'keywords' : 'winking face face happy mischievous secret wink winking friendly joke'
    },
    'information_desk_person' : {
        'unicode' : '1F481',
        'shortname' : ':information_desk_person:',
        'aliases' : '',
        'keywords' : 'information desk person female girl human woman information help question answer sassy unimpress'
    },
    'relieved' : {
        'unicode' : '1F60C',
        'shortname' : ':relieved:',
        'aliases' : '',
        'keywords' : 'relieved face face happiness massage phew relaxed relieved satisfied phew relief'
    },
    'see_no_evil' : {
        'unicode' : '1F648',
        'shortname' : ':see_no_evil:',
        'aliases' : '',
        'keywords' : 'see-no-evil monkey animal monkey nature monkey see eyes vision sight mizaru'
    },
    'v' : {
        'unicode' : '270C',
        'shortname' : ':v:',
        'aliases' : '',
        'keywords' : 'victory hand fingers hand ohyeah peace two victory'
    },
    'pray' : {
        'unicode' : '1F64F',
        'shortname' : ':pray:',
        'aliases' : '',
        'keywords' : 'person with folded hands highfive hope namaste please wish pray high five hands sorrow regret sor'
    },
    'yum' : {
        'unicode' : '1F60B',
        'shortname' : ':yum:',
        'aliases' : '',
        'keywords' : 'face savouring delicious food face happy joy smile tongue delicious savoring food eat yummy yum t'
    },
    'stuck_out_tongue_winking_eye' : {
        'unicode' : '1F61C',
        'shortname' : ':stuck_out_tongue_winking_eye:',
        'aliases' : '',
        'keywords' : 'face with stuck-out tongue and winking eye childish face mischievous playful prank tongue wink '
    },
    'notes' : {
        'unicode' : '1F3B6',
        'shortname' : ':notes:',
        'aliases' : '',
        'keywords' : 'multiple musical notes music score musical music notes music sound melody'
    },
    'eyes' : { 'unicode' : '1F440', 'shortname' : ':eyes:', 'aliases' : '', 'keywords' : 'eyes look peek stalk watch' },
    'smile' : {
        'unicode' : '1F604',
        'shortname' : ':smile:',
        'aliases' : '',
        'keywords' : 'smiling face with open mouth and smiling eyes face funny haha happy joy laugh smile smiley smilin'
    },
    'disappointed' : {
        'unicode' : '1F61E',
        'shortname' : ':disappointed:',
        'aliases' : '',
        'keywords' : 'disappointed face disappointed disappoint frown depressed discouraged face sad upset'
    },
    'raised_hand' : {
        'unicode' : '270B',
        'shortname' : ':raised_hand:',
        'aliases' : '',
        'keywords' : 'raised hand female girl woman'
    },
    'clap' : {
        'unicode' : '1F44F',
        'shortname' : ':clap:',
        'aliases' : '',
        'keywords' : 'clapping hands sign applause congrats hands praise clapping appreciation approval sound encourage'
    },
    'speak_no_evil' : {
        'unicode' : '1F64A',
        'shortname' : ':speak_no_evil:',
        'aliases' : '',
        'keywords' : 'speak-no-evil monkey animal monkey monkey mouth talk say words verbal verbalize oral iwazaru'
    },
    'cry' : {
        'unicode' : '1F622',
        'shortname' : ':cry:',
        'aliases' : '',
        'keywords' : 'crying face face sad sad cry tear weep tears'
    },
    'rage' : {
        'unicode' : '1F621',
        'shortname' : ':rage:',
        'aliases' : '',
        'keywords' : 'pouting face angry despise hate mad pout anger rage irate'
    },
    'tired_face' : {
        'unicode' : '1F62B',
        'shortname' : ':tired_face:',
        'aliases' : '',
        'keywords' : 'tired face face frustrated sick upset whine exhausted sleepy tired'
    },
    'scream' : {
        'unicode' : '1F631',
        'shortname' : ':scream:',
        'aliases' : '',
        'keywords' : 'face screaming in fear face munch scream painting artist alien'
    },
    'purple_heart' : {
        'unicode' : '1F49C',
        'shortname' : ':purple_heart:',
        'aliases' : '',
        'keywords' : 'purple heart affection like love valentines purple violet heart love sensitive understanding comp'
    },
    'broken_heart' : {
        'unicode' : '1F494',
        'shortname' : ':broken_heart:',
        'aliases' : '',
        'keywords' : 'broken heart sad sorry'
    },
    'kiss' : {
        'unicode' : '1F48B',
        'shortname' : ':kiss:',
        'aliases' : '',
        'keywords' : 'kiss mark affection face like lips love valentines'
    },
    'blue_heart' : {
        'unicode' : '1F499',
        'shortname' : ':blue_heart:',
        'aliases' : '',
        'keywords' : 'blue heart affection like love valentines blue heart love stability truth loyalty trust'
    },
    'sleepy' : {
        'unicode' : '1F62A',
        'shortname' : ':sleepy:',
        'aliases' : '',
        'keywords' : 'sleepy face face rest tired sleepy tired exhausted'
    },
    'sweat_smile' : {
        'unicode' : '1F605',
        'shortname' : ':sweat_smile:',
        'aliases' : '',
        'keywords' : 'smiling face with open mouth and cold sweat face happy hot smiling cold sweat perspiration'
    },
    'stuck_out_tongue_closed_eyes' : {
        'unicode' : '1F61D',
        'shortname' : ':stuck_out_tongue_closed_eyes:',
        'aliases' : '',
        'keywords' : 'face with stuck-out tongue and tightly-closed eyes face mischievous playful prank tongue kidding '
    },
    'punch' : {
        'unicode' : '1F44A',
        'shortname' : ':punch:',
        'aliases' : '',
        'keywords' : 'fisted hand sign fist hand'
    },
    'triumph' : {
        'unicode' : '1F624',
        'shortname' : ':triumph:',
        'aliases' : '',
        'keywords' : 'face with look of triumph face gas phew triumph steam breath'
    },
    'sparkling_heart' : {
        'unicode' : '1F496',
        'shortname' : ':sparkling_heart:',
        'aliases' : '',
        'keywords' : 'sparkling heart affection like love valentines'
    },
    'smiley' : {
        'unicode' : '1F603',
        'shortname' : ':smiley:',
        'aliases' : '',
        'keywords' : 'smiling face with open mouth face haha happy joy smiling smile smiley'
    },
    'sunny' : {
        'unicode' : '2600',
        'shortname' : ':sunny:',
        'aliases' : '',
        'keywords' : 'black sun with rays brightness weather'
    }
};

var detectEmoji = function(messageText){
    return messageText.replace(emojiRegExp, function(emoji, cleanEmoji){
        if(emojiData[cleanEmoji]) {
            return createImageUrl(cleanEmoji);
        }
        return emoji;
    });
};

module.exports = function(messageText){
    return new vow.Promise(function(resolve){
        if(!messageText.length) {
            resolve(messageText);
        }

        var resultStr = detectEmoji(messageText);
        resolve(resultStr);
    });
};





