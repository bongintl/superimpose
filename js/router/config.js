module.exports = {
    
    element: 'main',
    
    routes: {
        '/': 'home',
        '/work': 'work',
        '/archive': 'work',
        '/about': 'about',
        '/project/:slug': 'project',
        '/post/:slug': 'post'
    }
    
}