const express = require('express');
const router = express.Router();
const Services = require('../models/Customers');




router.get('/', (req, res) => {
    res.render('addservice', {
      user: req.user,
      viewTitle: "Add Service"
    })
});

// @desc    Show edit page
// @route   GET /portfolio/edit/:id
router.get('/:id', (req, res) => {
  Services.findById(req.params.id, (err, doc) => {
      if (!err) {
      res.render('editservice', {
        user: req.user,
        viewTitle: "Update Service",
        services: doc
      })
    }
  });
})


// @desc    Show service detail page
// @route   GET /services/add_detail/:id
router.get('/add_detail/:id', (req, res) => {
  Services.findById(req.params.id, (err, doc) => {
      if (!err) {

        // Services.find()
        // .then(services => {
        //   res.render('manage_services', {
        //     user: req.user,
        //     services: services,
        //     viewTitle: "Manage",
        //   })
        // })

      res.render('manage_services_detail', {
        user: req.user,
        viewTitle: "Update Service",
        services: doc
      })
    }
  });
})


router.post('/add', (req, res) => {
    user = req.user;

    const { title, short_desc, description, service_img, icon_img} = req.body;
    //console.log(req.body);
    let errors = [];
    if (!title || !short_desc || !description) {
      errors.push({ msg: 'Please enter all fields' });
      // req.flash(
      //   'error_msg',
      //   'Please enter empty fields'
      // );
      // res.redirect('/portfolio');
    }

    if (errors.length > 0) {

        res.render('addservice', {
          user: req.user,
          viewTitle: "Add Service",
            errors,
            title,
            short_desc,
            description,
            service_img: req.files['service_img'][0],
            icon_img: req.files['icon_img'][0]
        })

    } else {
      Services.findOne({ title: title }).then(services => {
        if (services) {
          errors.push({ msg: 'Service already exists' });

          res.render('addservice', {
          user: req.user,
          viewTitle: "Add Service",
            errors,
            title,
            short_desc,
            description,
            service_img: req.files['service_img'][0],
            icon_img: req.files['icon_img'][0]
        })
        } else {
          const newServices = new Services({
            title,
            short_desc,
            description,
            service_img: req.files['service_img'][0],
            icon_img: req.files['icon_img'][0]
          })
          newServices
          .save()
          .then(services => {
            req.flash(
              'success_msg',
              'Service added successfully.'
            );
            res.redirect('/services');
          })
          .catch(errors => console.log(errors))
        }
      });
    }
});


router.post('/edit/:id', (req, res) => {
  if(req.files['service_img']){
   var dataRecord = {
    title: req.body.title,
    short_desc: req.body.short_desc,
    description: req.body.description,
    service_img: req.files['service_img'][0],
    icon_img: req.files['icon_img'][0]
  }
  if(req.body.oldpic){
  fs.unlinkSync(appRoot+'/uploads/services/' + req.body.oldpic);
  fs.unlinkSync(appRoot+'/uploads/services/' + req.body.oldpicIcon);
  }

  }else{
    var dataRecord = {
      title: req.body.title,
      short_desc: req.body.short_desc,
      description: req.body.description
    }
  }
  var update = Services.findByIdAndUpdate(req.params.id, dataRecord, function (err, docs) {
    if (err){
      console.log(err);
      Services.findOne({ id: req.params.id }).then(services => {
        req.flash(
          'error_msg',
          'Service not updated check all fields!'
        );
        res.render(`/services/edit/${req.body._id}`, {
          user: req.user,
          viewTitle: "Update Service",
          services: services
        });
      });
    }
    else{
        console.log("Service Updated: ", docs);
        req.flash(
          'success_msg',
          'Service updated successfully.'
        );
        res.redirect(`/manage`);
    }
});
});

router.get('/delete/:id', (req, res) => {
  Services.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            req.flash(
                'success_msg',
                'Service deleted successfully.'
              );
            res.redirect('/manage');
        }
        else {
            req.flash(
                'error_msg',
                'Service not deleted!'
            );
            res.redirect('/manage');
        }
    });
});




router.post('/processdetail', (req, res) => {
  user = req.user;

  const { title, short_desc, service_id, icon_img} = req.body;
  //console.log(req.body);
  let errors = [];
  if (!title || !short_desc || !service_id) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {

      res.render('manage_services_detail', {
        user: req.user,
        viewTitle: "Update Service",
          errors,
          title,
          service_id,
          short_desc,
          icon_img: req.files['icon_img'][0]
      })

  } else {
    ServicesDetail.findOne({ title: title }).then(servicesdetail => {
      if (servicesdetail) {
        errors.push({ msg: 'Service Detail already exists' });

        res.render('manage_services_detail', {
        user: req.user,
        viewTitle: "Update Service",
        errors,
        title,
        service_id,
        short_desc,
        icon_img: req.files['icon_img'][0]
      })
      } else {
        const newServicesDetail = new ServicesDetail({
          title,
          service_id,
          short_desc,
          icon_img: req.files['icon_img'][0]
        })
        newServicesDetail
        .save()
        .then(servicesdetail => {
          req.flash(
            'success_msg',
            'Service Detail added successfully.'
          );
          res.redirect('/add_detail/'+service_id);
        })
        .catch(errors => console.log(errors))
      }
    });
  }
});



module.exports = router;