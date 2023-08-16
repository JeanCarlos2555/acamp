const User = require("../models/login/User")
const retorno = require('../functions/retorno')

async function auth(req,res,next) {
    try {
        const user = req.session.user
        if (user != undefined) {
            const usuario = await User.findOne({where:{id:user,status:true},attributes:['id']})
            if (usuario != undefined) {
                next()
            } else {
                retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/login',erro:'Seu usuario não tem permissão para acessar, gentileza realize o login novamente!'})
            }
        } else {
            retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/login',erro:'Nenhum usuário logado foi identificado, gentileza realizar o login'})
        }
    } catch (error) {
        retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/login',erro:'Ops, sua sessão expirou! Por gentileza realize o login e tente novamente!'})
    }
}

module.exports = auth