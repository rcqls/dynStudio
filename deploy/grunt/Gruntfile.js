module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: '../../build', // Where the build version of my node-webkit app is saved
        version: '0.8.4', //0.8.4 fails do not know why???? TODO LATER
        //credits: './public/credits.html',
        mac_icns: '/Users/remy/Github/dynStudio/rsrc/dynStudio.icns', // Path to the Mac icon file
        mac: true, // We want to build it for mac
        win: true, // We want to build it for win
        linux32: true, // We don't need linux32
        linux64: true, // We don't need linux64
      },
      src: '/Users/remy/Github/dynStudio/src/**/*' // Your node-webkit app
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};