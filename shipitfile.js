module.exports = function (shipit) {
  shipit.initConfig({
    default: {
      branch: 'master',
    },
    staging: {
      servers: 'firebelly@firebelly.webfactional.com'
    }
  })

  shipit.blTask('build', function () {
    return shipit.local('yarn production')
  })

  shipit.blTask('clean', function () {
    return shipit.remote(
      'rm -rf /home/users/firebelly/webapps/dbc/*'
    )
  })

  shipit.task('copy', function () {
    shipit.remoteCopy(
      './_site/',
      '/home/users/firebelly/webapps/dbc'
    )
  })

  shipit.task('deploy', function () {
    shipit.start('build', 'clean', 'copy')
  })
}
