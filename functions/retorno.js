function retorno(prop) {
    if (prop.path.toLowerCase().includes('/api')) {
        prop.res.status(400).json({erro:prop.erro})
    }else{
        console.log(prop.erro)
        prop.req.flash('erro',prop.erro)
        prop.res.redirect(prop.redirect)
    }
}

module.exports = retorno