importScripts('js/sw-utils.js');




const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-1';
const INMUTABLE_CACHE = 'inmutable';

const APP_SHEEL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/deadpool.jpg',
    'img/avatars/venom.jpg',
    'img/avatars/carnage.jpg',
    'img/avatars/punisher.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/ghostrider.jpg',
    'img/avatars/greengoblin.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHEEL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Instalación del Service Worker con manejo de errores
self.addEventListener('install', e =>{
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHEEL).catch(err =>{
            console.error('Error al agregar al cache estatico:', err);
        })
    );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHEEL_INMUTABLE).catch(err =>{
            console.error('Error al agregar al cache inmutable:', err)
        })
    );

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

//Activacion del Service Worker
self.addEventListener('activate', e =>{
    const respuesta = caches.keys().then(keys =>{
        return Promise.all(
            keys.map(key => {
                if (key !== STATIC_CACHE && key.includes('static')){

                }
            })
        );
    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e=> {
    const respuesta = caches.match(e.request).then(res => {
        if(res){
            return res;
        }else{
            return fetch(e.request).then(newRes =>{
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request,newRes);
            });
        }
    });
    e.respondWith(respuesta);
});