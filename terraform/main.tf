resource "aws_route53_zone" "forum" {
  name = var.zone_name
}

resource "aws_elastic_beanstalk_application" "forum" {
  name = "forum"
}

resource "aws_elastic_beanstalk_environment" "forum_env" {
  name                = "forum-env"
  application         = aws_elastic_beanstalk_application.forum.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.9 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }
}

data "aws_elastic_beanstalk_hosted_zone" "current" {

}

resource "aws_route53_record" "forum" {
  zone_id = aws_route53_zone.forum.zone_id
  name    = "forum"
  type    = "A"

  alias {
    name                   = aws_elastic_beanstalk_environment.forum_env.cname
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.current.id
    evaluate_target_health = true
  }
}

resource "aws_default_vpc" "default" {

}

resource "aws_security_group" "rds_connection" {
  name   = "rds_connection"
  vpc_id = aws_default_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 6379
    cidr_blocks = [var.rds_connection_cidr_block]
    protocol    = "TCP"
  }
}

resource "aws_db_instance" "pg" {
  engine                       = "postgres"
  engine_version               = "12.5"
  name                         = var.rds_db_name
  allocated_storage            = 10
  instance_class               = "db.t2.micro"
  username                     = var.rds_username
  password                     = var.rds_password
  multi_az                     = false
  skip_final_snapshot          = true
  vpc_security_group_ids       = [aws_security_group.rds_connection.id]
  performance_insights_enabled = false
}
