PROJECT_NAME = "kwhen"
PROJECT_DIR = "/home/#{PROJECT_NAME}/#{PROJECT_NAME}/src"

Vagrant.require_version ">= 1.8.1"
Vagrant.configure(2) do |config|

  config.vm.hostname = PROJECT_NAME
  config.vm.box = "ubuntu/trusty64"

  config.vm.network :private_network, ip: "192.168.33.35"
  config.vm.synced_folder ".", PROJECT_DIR

  config.vm.provider :virtualbox do |vb|
    vb.name = PROJECT_NAME
    vb.memory = "2048"
    vb.cpus = 2
    vb.gui = false
  end

  config.vm.provision "shell" do |s|
    ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
    s.inline = <<-SHELL
      echo #{ssh_pub_key} >> /home/vagrant/.ssh/authorized_keys
      echo #{ssh_pub_key} >> /root/.ssh/authorized_keys
    SHELL
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/site.yml"
    ansible.inventory_path = "ansible/vagrant.ini"
    ansible.host_key_checking = false
    ansible.limit = "*"
  end
end
