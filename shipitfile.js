module.exports = function (shipit) {
  shipit.initConfig({
    staging: {
      servers: 'firebelly@firebelly.webfactional.com'
    }
  })

  shipit.blTask('build', function () {
    return shipit.local('yarn production')
  })

  shipit.blTask('clean', function () {
    return shipit.remote(
      'rm -rf /home/users/firebelly/webapps/dbc/public/*'
    )
  })

  shipit.task('copy', function () {
    shipit.remoteCopy(
      './_site/',
      '/home/users/firebelly/webapps/dbc/public'
    )
  })

  shipit.task('deploy', function () {
    shipit.start('build', 'clean', 'copy')
  })
}
