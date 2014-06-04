'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    srcDir: './src',
    baseFileName: 'dist/<%= pkg.name %>',
    watch: {
      src: {
        files: '<%= srcDir %>/**/*.js',
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      demo: {
        files: './demo/**/*',
        options: {
          livereload: true
        }
      }
    },
    concat: {
      dist: {
        src: [
          '<%= srcDir %>/header.js',
          '<%= srcDir %>/sections/sections.js',
          '<%= srcDir %>/sections/config.js',
          '<%= srcDir %>/sections/utils.js',
          '<%= srcDir %>/sections/events.js',
          '<%= srcDir %>/sections/transition.js',
          '<%= srcDir %>/sections/section.js',
          '<%= srcDir %>/sections/animate.js',
          '<%= srcDir %>/sections/proto.js',
          '<%= srcDir %>/sections/index.js',
          '<%= srcDir %>/footer.js'
        ],
        dest: '<%= baseFileName %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> | ' +
          'Copyright (c) 2013 Po-Ying Chen <poying.me@gmail.com> */\n\n'
      },
      dist: {
        options: {
          mangle: false,
          beautify: true,
          compress: false
        },
        files: {
          '<%= baseFileName %>.js': ['<%= concat.dist.dest %>']
        }
      },
      min: {
        options: {
          sourceMap: '<%= baseFileName %>.map'
        },
        files: {
          '<%= baseFileName %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);
};
