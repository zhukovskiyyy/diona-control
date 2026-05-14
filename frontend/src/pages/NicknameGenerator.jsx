import {
  useState
} from 'react';

import {
  Copy,
  Check,
  RefreshCw,
  LoaderCircle,
  Trash2
} from 'lucide-react';

const { ipcRenderer } =
  window.require('electron');


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
  'namexname',
  'namexword',
  'wordxname',
  'name123',
  'word123',
  'name_word123',
  'softname',
  'doubleword',
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
        '--',
        '-'
      )
      .replaceAll(
        '123',
        Math.floor(
          Math.random() *
          9999
        )
      )
      .replaceAll(
        'xname',
        `x${secondName}`
      );

  username =
    username
      .replace(/\./g, '')
      .replace(/-{2,}/g, '-')
      .replace(/_{2,}/g, '_')
      .replace(/^[-_]+/, '')
      .replace(/[-_]+$/, '');

  return username.toLowerCase();

}

function NicknameGenerator() {

  const [nicknames, setNicknames] =
    useState(() => {

      const saved =
        localStorage.getItem(
          'generatedNicknames'
        );

      return saved
        ? JSON.parse(saved)
        : [];

    });

  const [loading, setLoading] =
    useState(false);

  const [copiedNick, setCopiedNick] =
    useState(null);

  async function generateNicknames() {

    setLoading(true);

    setNicknames([]);

    localStorage.removeItem(
      'generatedNicknames'
    );

    const generated =
      new Set();

    while (
      generated.size < 10
    ) {

      const username =
        generateUsername();

      if (
        generated.has(
          username
        )
      ) {
        continue;
      }

      try {

        const result =
          await ipcRenderer.invoke(

            'check-username',

            username

          );

        if (
          result.available
        ) {

          generated.add(
            username
          );

          const arr =
            Array.from(
              generated
            );

          setNicknames(arr);

          localStorage.setItem(

            'generatedNicknames',

            JSON.stringify(arr)

          );

        }

        await new Promise(
          (r) =>
            setTimeout(
              r,
              80
            )
        );

      } catch (err) {

        console.log(err);

      }

    }

    setLoading(false);

  }

  async function copyNickname(
    text
  ) {

    await navigator.clipboard.writeText(
      text
    );

    setCopiedNick(text);

    setTimeout(() => {

      setCopiedNick(null);

    }, 1200);

  }

  function clearNicknames() {

    setNicknames([]);

    localStorage.removeItem(
      'generatedNicknames'
    );

  }

  return (

    <div>

      <div className="devices-header">

        <div>

          <h1>
            Diona Nickname Generator
          </h1>

          <p>
            Генератор никнеймов для платформ
          </p>

        </div>

      </div>

      <div
        className="device-card"
        style={{
          marginTop: 20
        }}
      >

        <div

          style={{

            display: 'flex',

            gap: 12,

            flexWrap: 'wrap'

          }}

        >

          <button

            className="scan-btn"

            disabled={loading}

            onClick={
              generateNicknames
            }

            style={{

              opacity:
                loading ? 0.7 : 1,

              cursor:
                loading
                  ? 'not-allowed'
                  : 'pointer',

              display: 'flex',

              alignItems: 'center',

              gap: 10

            }}

          >

            {loading ? (

              <LoaderCircle
                size={18}
                className="spin"
              />

            ) : (

              <RefreshCw size={16} />

            )}

            {loading
              ? 'Generating usernames...'
              : 'Generate usernames'}

          </button>

          <button

            onClick={
              clearNicknames
            }

            style={{

              background:
                '#ff3b5c',

              border: 'none',

              color: 'white',

              padding:
                '0 18px',

              borderRadius: 14,

              cursor: 'pointer',

              display: 'flex',

              alignItems: 'center',

              gap: 8,

              fontWeight: 600

            }}

          >

            <Trash2 size={16} />

            Clear

          </button>

        </div>

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
            nick
          ) => (

            <div

              key={nick}

              className="device-card"

              style={{

                display: 'flex',

                justifyContent:
                  'space-between',

                alignItems: 'center',

                animation:
                  'fadeIn 0.35s ease'

              }}

            >

              <div>

                <div

                  style={{

                    opacity: 0.45,

                    fontSize: 12

                  }}

                >

                  AVAILABLE

                </div>

                <div

                  style={{

                    marginTop: 10,

                    fontSize: 26,

                    fontWeight: 700,

                    wordBreak:
                      'break-word'

                  }}

                >

                  {nick}

                </div>

              </div>

              <button

                onClick={() =>
                  copyNickname(
                    nick
                  )
                }

                style={{

                  width: 48,

                  height: 48,

                  borderRadius: 14,

                  border: 'none',

                  cursor: 'pointer',

                  background:

                    copiedNick === nick

                      ? 'rgba(77,255,145,0.18)'

                      : 'rgba(255,255,255,0.06)',

                  transition:
                    '0.25s ease',

                  color: 'white'

                }}

              >

                {copiedNick === nick ? (

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

      <style>

        {`

          .spin {

            animation:
              spin 1s linear infinite;

          }

          @keyframes spin {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }

          }

          @keyframes fadeIn {

            from {

              opacity: 0;

              transform:
                translateY(8px);

            }

            to {

              opacity: 1;

              transform:
                translateY(0);

            }

          }

        `}

      </style>

    </div>

  );

}

export default NicknameGenerator;