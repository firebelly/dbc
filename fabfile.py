from fabric.api import *
import os

env.hosts = ['firebelly.co']
env.user = 'firebelly'
env.path = '~/Sites/dbc'
env.remotepath = '/home/firebelly/webapps/dbc'
env.git_branch = 'master'
env.warn_only = True
env.remote_protocol = 'http'

def deploy():
  copy()

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))

def copy():
  put('_site', '/home/firebelly/webapps/dbc/')