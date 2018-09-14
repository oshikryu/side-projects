module.exports = (grunt) ->
  port = grunt.option('port') or 8888  # server port

  grunt.initConfig(
    clean: ['deploy/']

    copy:
      dev:
        files: [
          expand: true
          cwd: 'app/'
          src: [
            '**'
            '!**/*.less'
          ]
          dest: 'deploy/'
        ]

      test:
        files: [
          expand: true
          cwd: 'test/'
          src: [
            '**'
          ]
          dest: 'deploy/test'
        ]
        
    coffee:
      dev:
        options:
          bare: true
        files: [
          expand: true
          src: ['deploy/**/*.coffee']
          ext: '.js'
        ]

      test:
        options:
          bare: true
        files: [
          expand: true
          src: ['deploy/**/*.coffee']
          ext: '.js'
        ]

    less:
      dev:
        src: 'app/application.less'
        dest: 'deploy/application.css'



    watch:
      options:
        nospawn: true
        force: true

      all:
        files: [
          'app/**/*'
          'app/lib/**/*'
          'app/lib/images/**/*'
          '!app/**/*.coffee'
          '!test/**/*.coffee'
        ]
        tasks: [
          'copy:dev'
          'copy:test'
          'less:dev'
          'notify:copy'
        ]
        
      scripts:
        files: ['app/**/*.coffee']
        tasks: ['copy:dev', 'coffee:dev', 'notify:dev']
        
    open:
      test:
        path: 'http://localhost:' + port + '/test/runner.html'

    mocha_phantomjs:
      options:
        reporter: 'dot'
      test: ['deploy/test/runner.html']

    'http-server':
      dev:
        root: 'deploy/'
        port: port
        host: '0.0.0.0'

    notify:
      dev:
        options:
          title: 'Grunt Task Complete'
          message: 'Built dev'
      less:
        options:
          title: 'Grunt Task Complete'
          message: 'Built less'
      coffee:
        options:
          title: 'Grunt Task Complete'
          message: 'Built coffee'
      copy:
        options:
          title: 'Grunt Task Complete'
          message: 'Copied files to build directory'

    markdown:
      rnotes:
        files: [
          src: 'release_notes/notes.markdown'
          dest: 'release_notes/notes.html'
        ]
        options:
          template: 'release_notes/tmp.jst'

  )

  _onWatchCopy = (filepath) ->
    files = grunt.config('copy.dev.files')

    cwd = files[0].cwd
    regex = new RegExp '^' + cwd
    _filepath = filepath.replace regex, ''

    files[0].src = [_filepath]
    grunt.config('copy.dev.files', files)

  _onWatchCoffee = (filepath) ->
    files = grunt.config('coffee.dev.files')

    if grunt.file.isMatch grunt.config('watch.scripts.files'), filepath
      regex = new RegExp '^' + 'app/'
      _filepath = filepath.replace regex, 'deploy/'

    else
      _filepath = ''

    files[0].src = [_filepath]
    grunt.config('coffee.dev.files', files)

  grunt.event.on 'watch', (action, filepath) ->
    _onWatchCopy filepath
    _onWatchCoffee filepath

  # Load plugins
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-open'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-markdown'
  grunt.loadNpmTasks 'grunt-mocha-phantomjs'
  grunt.loadNpmTasks 'grunt-http-server'

  # Available tasks
  grunt.registerTask 'default', ['clean', 'copy:dev', 'coffee:dev', 'less:dev']
  grunt.registerTask 'test-compile', ['copy:test', 'coffee:test', 'open:test']
  grunt.registerTask 'test-phantomjs', ['mocha_phantomjs:test']
  grunt.registerTask 'server', ['http-server:dev']
