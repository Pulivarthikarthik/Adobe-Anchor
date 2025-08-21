module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

// used when mismatch in datatypes like price is no. but str is given

