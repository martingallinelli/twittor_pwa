// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// archivos necesiarios para el funcionamiento de la aplicación
const APP_SHELL = [
    '/', //no funciona en produccion
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/sw-utils.js',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg'
];

// archivos inmutables 
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//! INSTALAR SW
self.addEventListener('install', e => {
    // guardar en cache los archivos estaticos
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => cache.addAll( APP_SHELL ));
    // guardar en cache los archivos inmutables
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => cache.addAll( APP_SHELL_INMUTABLE ));

    // esperar a que se instale el SW
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
});

//! ACTIVAR SW
self.addEventListener('activate', e => {
    // borrar los caches antiguos
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            // si el cache static no es el actual, lo eliminamos
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete( key );
            }

            // si el cache dynamic no es el actual, lo eliminamos
            if ( key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete( key );
            }
        });
    });

    // esperar a que se active el SW
    e.waitUntil( respuesta );
});

//! FETCH - estrategia cache
self.addEventListener('fetch', e => {
    // buscar en el cache
    const respuesta = caches.match( e.request )
        .then( res => {
            // si encontro el recurso, lo devuelvo
            if ( res ) {
                return res;
            } else {
                console.log('No existe en caché, ' + e.request.url);

                // si no existe en caché, lo buscamos en el servidor
                return fetch( e.request )
                    .then( newRes => {
                        // actualizar el cache dinamico
                        return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
                    });
            }
        });
    
    // devolver la respuesta
    e.respondWith( respuesta );
});