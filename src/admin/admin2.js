const express = require("express")
const router  = express.Router();

router.get('/admin/:action?/:id?',(req,res)=>{

    const output={
        ...req.params,
        url:req.url,
        baseUrl:req.baseUrl
    }
    res.json(output)
})

module.exports = router 