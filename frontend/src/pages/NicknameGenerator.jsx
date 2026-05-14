import {
  useState
} from 'react';

import {
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

/* HUGE DATASET */

const firstNames = [

  'emma','luna','melisa','flora','yuki','sophie','alice','mia','olivia','ava','ella','chloe','zoe','lily','ruby','grace','hannah','stella','ivy','nina',
  'bella','aria','layla','lucy','eva','rose','violet','hazel','maya','leah','naomi','clara','aurora','elena','isla','willow','jade','daisy','sadie','nova',
  'camila','elsa','julia','piper','melody','violetta','amira','alyssa','skye','summer','sienna','celine','lana','rina','mila','anya','lena','marie','eve','alina',
  'valerie','sasha','kira','noelle','selena','jasmine','lexi','lola','pearl','phoebe','riley','sabrina','tessa','vivian','winnie','zara','adeline','amelia','angelina','anita',
  'ariah','ashley','athena','autumn','bailey','beatrice','blair','brielle','brooke','cassie','celeste','charlotte','chelsea','cora','delilah','diana','eden','elise','ember','esme',
  'faith','faye','francesca','freya','gemma','gianna','giselle','harper','heidi','holly','iris','isabel','jessie','joy','juliet','kayla','keira','kim','kiara','lara',
  'lauren','lexa','lia','linda','livia','lucia','madison','margo','maria','marnie','megan','michelle','monica','nancy','natalia','nicole','ophelia','paige','penelope','quinn',
  'reese','rina','rosalie','sara','savannah','scarlett','serena','sierra','skylar','sofia','talia','tamara','teagan','valentina','vanessa','vera','victoria','violeta','winter','yasmin'

];

const softWords = [

  'kitty','angel','dreamy','velvet','bunny','baby','meow','cloud','nova','honey','blush','moonlight','sugar','peach','glow','lucky','sweet','softie','cutie','fairy',
  'darling','starlight','cosmic','bubble','petal','doll','kiss','sparkle','velour','misty','silky','cotton','mellow','sunset','berry','vanilla','candy','milk','cream','halo',
  'angelic','plush','frost','hazy','sunny','cupid','dew','snowy','cozy','bloom','rosy','pinky','satin','twinkle','lush','butter','latte','cookie','cherry',
  'mallow','jelly','pearl','starry','lunar','heaven','flora','petals','snow','skies','pixie','bliss','lovely','wildflower','cute',
  'naughty','spicy','toxic','sinful','vibes','serenity','midnight','daydream','breezy','ocean','marine','lavender','bubblegum','heart','babygirl','sweetheart','glimmer','babe','fuzzy',
  'mist','rainy','shimmer','milkshake','teddy','strawberry','blueberry','raspberry','lemon','lime','mocha','caramel','cinnamon','sugarplum','snowflake','sunbeam','moonbeam','coconut',
  'butterfly','stargirl','babydoll','cottoncandy','fairydust','glossy','lipgloss','champagne','marshmallow','bubbletea','cupcake','donut','pudding','waffle','sprinkle','confetti','lollipop','glitter',
  'dreamgirl','babylove','cutecore','pretty','heartbreaker','lovebug','hottie','baddie','babes','kisses','wink','tempting','starshine','skylight','moondust','rainbow','icy','opal',
  'gem','crystal','diamond','sapphire','ruby','emerald','goldie','silver','onyx','jade','peony','lotus','iris','tulip','orchid','garden','meadow','forest','river','waves'

];

const endings = [

  'xo','xx','baby','kitty','love','hot','glow','angel','69','x','bunny','bae','girl','online','live','tv','world','verse','dream','core',
  'hub','land','zone','wave','vibes','magic','kiss','meow','doll','pie','babe','luv','xoxo','star','cat','fox','kitten','princess','queen','lady',
  'daily','official','real','irl','vip','plus','club','worldwide','archive','diary','journal','central','space','vision'

];

const patterns = [

  'name_word',
  'word_name',
  'nameword',
  'wordname',
  'name_word_end',
  'word_name_end',
  'name.end',
  'word.end',
  'namexname',
  'namexword',
  'wordxname',
  'name123',
  'word123',
  'name_word123',
  'softname',
  'doubleword',
  'name.word',
  'word.name',
  'name__word',
  'word__name',
  'name-word',
  'word-name',
  'realname',
  'officialname',
  'nameonline',
  'nameirl',
  'namehub',
  'wordhub',
  'nameverse',
  'wordverse',
  'nameworld',
  'wordworld',
  'namebaby',
  'wordbaby',
  'nameangel',
  'wordangel',
  'namekitty',
  'wordkitty',
  'namedoll',
  'worddoll',
  'namekiss',
  'wordkiss',
  'nameglow',
  'wordglow',
  'namedream',
  'worddream'

];

function random(arr) {

  return arr[
    Math.floor(
      Math.random() *
      arr.length
    )
  ];

}

function generateUsername() {

  const name =
    random(firstNames);

  const secondName =
    random(firstNames);

  const word =
    random(softWords);

  const end =
    random(endings);

  let pattern =
    random(patterns);

  let username =
    pattern
      .replaceAll(
        'name',
        name
      )
      .replaceAll(
        'word',
        word
      )
      .replaceAll(
        'end',
        end
      );

  username =
    username
      .replaceAll(
        '__',
        '_'
      )
      .replaceAll(
        '123',
        Math.floor(
          Math.random() *
          999
        )
      )
      .replaceAll(
        'xname',
        `x${secondName}`
      );

  return username.toLowerCase();

}

function NicknameGenerator() {

  const [nicknames, setNicknames] =
    useState([]);

  const [copiedIndex, setCopiedIndex] =
    useState(null);

  function generateNicknames() {

    const generated =
      new Set();

    while (
      generated.size < 100
    ) {

      generated.add(
        generateUsername()
      );

    }

    setNicknames(
      Array.from(generated)
    );

  }

  async function copyNickname(
    text,
    index
  ) {

    await navigator.clipboard.writeText(
      text
    );

    setCopiedIndex(index);

    setTimeout(() => {

      setCopiedIndex(null);

    }, 1000);

  }

  return (

    <div>

      <div className="devices-header">

        <div>

          <h1>
            Nickname Generator
          </h1>

          <p>
            Huge realistic username pool
          </p>

        </div>

      </div>

      <div
        className="device-card"
        style={{
          marginTop: 20
        }}
      >

        <button
          className="scan-btn"
          onClick={
            generateNicknames
          }
        >

          <RefreshCw size={16} />

          Generate 100 usernames

        </button>

      </div>

      <div

        style={{

          marginTop: 28,

          display: 'grid',

          gridTemplateColumns:
            'repeat(auto-fill,minmax(320px,1fr))',

          gap: 20

        }}

      >

        {nicknames.map(
          (
            nick,
            index
          ) => (

            <div

              key={index}

              className="device-card"

              style={{

                display: 'flex',

                justifyContent:
                  'space-between',

                alignItems: 'center'

              }}

            >

              <div>

                <div

                  style={{

                    opacity: 0.45,

                    fontSize: 12

                  }}

                >

                  GENERATED

                </div>

                <div

                  style={{

                    marginTop: 10,

                    fontSize: 26,

                    fontWeight: 700

                  }}

                >

                  {nick}

                </div>

              </div>

              <button

                onClick={() =>
                  copyNickname(
                    nick,
                    index
                  )
                }

                style={{

                  width: 48,

                  height: 48,

                  borderRadius: 14,

                  border: 'none',

                  cursor: 'pointer',

                  background:

                    copiedIndex === index

                      ? 'rgba(77,255,145,0.18)'

                      : 'rgba(255,255,255,0.06)',

                  transition:
                    '0.25s ease',

                  color: 'white'

                }}

              >

                {copiedIndex === index ? (

                  <Check
                    size={20}
                    color="#4dff91"
                  />

                ) : (

                  <Copy size={20} />

                )}

              </button>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default NicknameGenerator;