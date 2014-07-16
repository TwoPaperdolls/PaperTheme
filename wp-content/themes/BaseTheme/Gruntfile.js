module.exports = function (grunt) {
    'use strict';
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        /* =======================================================================
          Set Client Name variable to be used throughout task 
        ========================================================================== */
        clientName: '_TPD_BaseTheme',
        /* ======================================================================= */
                   

        pkg: grunt.file.readJSON('package.json'),
        // compile sass to css 
        compass: {
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'css'
                }
            },
            // remove comments for production
            prod: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'css',
                    outputStyle: 'compact',
                    noLineComments: true
                }
            }
        },
        // add browser prefixes to compiled css
        autoprefixer: {
          options: {
            browsers: ['last 1 version']
          },
          dev: {
            files: [{
              expand: true,
              cwd: 'css/',
              src: '*.css',
              dest: 'css/'
            }]
          }
        },
        // check js/ for syntax and other errors
        // don't check js/libs/
        jshint: {
            all: ['Gruntfile.js','js/*.js','!js/libs/**/*.js'],
            options:{
                reporter: require('jshint-stylish'),
            }
        },
        // concatenate css and js files (except ie.css and modernizr.custom.js, which need to remain separate)
        // output concatenated files to .tmp/assets
        concat: {
            css: {
                src: [
                    'css/*',
                    '!css/ie.css'
                ],
                dest: '.tmp/assets/css/style.min.css'
            },
            js: {
                src: [
                    'js/**/*.js',
                    '!js/libs/modernizr.custom.js'
                ],
                dest: '.tmp/assets/js/<%= clientName %>_js.min.js'
            }
        },
        // minify concatenated css in .tmp/
        cssmin: {
            css: {
                src: '.tmp/assets/css/style.min.css',
                dest: '.tmp/assets/css/style.min.css'
            }
        },
        // minify concatenated js
        uglify: {
            js: {
                files: {
                    '.tmp/assets/js/<%= clientName %>_js.min.js': ['.tmp/assets/js/<%= clientName %>_js.min.js']
                }
            },
            // minify and export modernizr to .tmp/assets/js/libs/
            modernizr:{files:{'.tmp/assets/js/libs/modernizr.custom.min.js': ['js/libs/modernizr.custom.js']}}
        },
        // compress images
        // output to .tmp/assets/imgs
        imagemin: {                          
          dynamic: {                         
            files: [{
              expand: true,                  
              cwd: 'imgs/',                   
              src: ['**/*.{png,jpg,gif}'],   
              dest: '.tmp/assets/imgs'                  
            }]
          }
        },
        // Empties .tmp folders to start fresh "grunt build"
        clean: {
          tmp: [
            ".tmp/",
            ".sass-cache"
            ]
        },
        // Copies all necessary php and assets to theme named "_production" parent directory
        copy: {
            ie: {
              files: [{
                expand: true, 
                src: ['css/ie.css'], 
                dest: '.tmp/assets', 
                filter: 'isFile'
              }]
            },
          prod: { 
            files: [{
                expand: true, 
                cwd:'./',
                src: ['**/*.php','style.css','layouts/*'], 
                dest: '../<%= clientName %>_production', 
                filter: 'isFile'
            }]
          },
          prodAssets:{
            files: [{
                expand: true, 
                cwd:'./.tmp',
                src: ['**'], 
                dest: '../<%= clientName %>_production/', 
                filter: 'isFile'
            }]
          },
          git:{
            files: [{
                expand: true, 
                cwd:'./',
                src: ['.git','.gitignore'], 
                dest: '../<%= clientName %>_production', 
            }]
          }
        },
        //replace all _s reference in ../<%= clientName %>_production/ with <%= clientName %>
       replace: {
          underscoresRefs: {
            src: '../<%= clientName %>_production/**/*.{php,css}',       
            overwrite:true,             
            replacements: [{
              from:  ' _s',                   
              to: ' <%= clientName %>'
            },{
              from: '@package _s',
              to: '@package <%= clientName %>'
            },{
              from: '_s_',
              to: '<%= clientName %>_'
            },{
              from: "'_s'",
              to: "'<%= clientName %>'"
            }]
          },
          assetsRefs: {
            src: '../<%= clientName %>_production/**/*.php',       
            overwrite:true,             
            replacements: [{
              // point /imgs, /js, and /css to proper assets folder
              from:  /\/(imgs|js|css)\b/g,                   
              to: function (matchedWord) { return "/assets" + matchedWord; }
            },
            {
              // add ".min " ref to enquequed files
              // this includes jquery as it is called unminified in the dev. environment
              // but gets called minified with "grunt build"
              from: /\.(css|js)\b/g,
              to: function (matchedWord) { return ".min" + matchedWord; }
            }]
          },
        },
        gitcheckout: {
          production: {
            options: {
              branch:'production',
              create: true,
              overwrite: true
            }
          }
        },
        shell:{
          // gitBranchProduction:{
          //   command:[
          //   'git branch production',
          //   'git checkout production'
          //   ].join('&&')
          // },
          gitAddProduction:{
            command:[
            'git add ../<%= clientName %>_production/',
            'git status',
            'git commit -m"generated from [`git name-rev --name-only $prevHEAD`] branch \n"+"`git log -1 HEAD`"'
            ].join('&&')
          }
        },
        notify:{
          watch:{
            options:{
              title: 'Watch Complete',  
              message: 'SASS, Uglify, JS Hint, Image min. finished \n'+'.tmp/assets created',
            }
          },
          testJS:{
            options:{
              title:'Test-js Complete',
              message:'JS linted, concated, and uglified \n' + '.tmp/assets/js created'
            }
          },
          build:{
            options:{
              title: '<%= clientName %>_production theme created',
              message:'git production branch created \n'+ 'you are now on the production branch'
            }
          }
        },
        // setup "grunt watch" task
        watch: {
            files: ['scss/**/*.scss', 'css/*', 'js/*.js', 'imgs/**/*.{png,jpg,jpeg,gif}'],
            tasks: ['compass:dev','autoprefixer','jshint','concat', 'cssmin', 'uglify', 'imagemin','notify:watch']
        }
    });
    // register "grunt watch" task for use
    grunt.registerTask('default', ['autoprefixer','concat','cssmin:css','jshint','uglify']);

    // setup and register "grunt test-js" task for use
    grunt.registerTask('test-js', ['jshint', 'concat:js', 'uglify:js', 'notify:testJS']);

    // setup and register "grunt build" to generate production theme
    grunt.registerTask('build', ['gitcheckout:production','compass:prod','autoprefixer','jshint','concat', 'cssmin', 'uglify', 'imagemin', 'copy', 'replace','shell:gitAddProduction', 'notify:build']);
};