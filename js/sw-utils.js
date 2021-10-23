//! ARCHIVO AUXILAR DEL SW

// actualizar el cache dinamico
function actualizarCacheDinamico(dynamicCache, req, res) {
    // si la petición es exitosa
    if (res.ok) {
        // acceder al cache dinamico
        return caches.open(dynamicCache)
            // almacenar la respuesta en el cache dinamico
            .then(cache => {
                cache.put(req, res.clone());
                // retornar la respuesta
                return res.clone();
            });
    // si la petición no es exitosa
    } else {
        // retornar la respuesta (error)
        return res;
    }
}