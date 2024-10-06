/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Parsconfig.hpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:10:52 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/09/04 18:55:46 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PARSCONFIG_HPP
#define PARSCONFIG_HPP

#include "webserv.h"
#include <map>

class Parsconfig
{
public:
    Parsconfig();
    Parsconfig(std::string file);
    ~Parsconfig();
    int *ft_split_int(const std::string &str, int &size);
    std::string *ft_split_string(const std::string &str, int &size);
    std::string get_value(const std::string &key, const std::string &file);
    int start(std::string str_file);
    void parseErrorPages(const std::string &locationBlock);
    void parseDataPaths(const std::string &locationBlock);
    void parseCgiPaths(const std::string &locationBlock);
    void parseUploadPaths(const std::string &locationBlock);

    std::vector<int> getPorts() const { return (_Port); };
    int getPortsCount() const { return (_NumberPorts); };
    std::string *getMethods() const { return (_Methods); };
    std::string getHost() const { return (_Host);};
    int getMethodsCount() const { return (_NumberMethods); };
    std::string *getMethodsSpe() const { return (_UploadsMethods); };
    int getMethodsCountSpe() const { return (_nbUploadsMethods); };
    std::string getName() const { return (_Name); };
    bool getAutoIndex() const { return (_AutoIndex); };
    size_t getMaxBodySize() const { return (_BodySize); };
    void freeAllocatedResources();
    std::string getError400() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(400);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/400.html";
    };
    std::string getError403() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(403);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/403.html";
    };
    std::string getError404() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(404);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/404.html";
    };
    std::string getError405() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(405);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/405.html";
    };
    std::string getError413() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(413);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/413.html";
    };
    std::string getError500() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(500);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/500.html";
    };
    std::string getError504() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(403);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/504.html";
    };
    std::string getError505() const
    {
        std::map<int, std::string>::const_iterator it = _ErrorPages.find(505);
        if (it != _ErrorPages.end())
        {
            ifstream fileExist;
            fileExist.open((it->second).c_str());
            if (fileExist) {
                fileExist.close();
                return it->second;
            }
            fileExist.close();
        }
        return "./html/error_pages/505.html";
    };
    std::string getDataPath(const std::string &key) const
    {
        std::map<std::string, std::string>::const_iterator it = _DataPaths.find(key);
        if (it != _DataPaths.end())
        {
            return it->second;
        }
        return "";
    }

    std::string getCgiPath(const std::string &key) const
    {
        std::map<std::string, std::string>::const_iterator it = _CgiPaths.find(key);
        if (it != _CgiPaths.end())
        {
            return it->second;
        }
        return "";
    }

    std::string *getUploadPath() const
    {
        return _UploadsMethods;
    }

    class Badfile : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: Cannot open file"; }
    };
    class Badname : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: server_name not found in config file"; }
    };
    class BadPort : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: ports incorrect"; }
    };
    class Badmethods : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: methods not allowed found in config file"; }
    };
    class Badclients : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: max clients value is false"; }
    };
    class Badtimeout : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: timeout value is false"; }
    };
    class BadErrorPage : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad page configuration"; }
    };
    class BadBodySize : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad body size"; }
    };
    class BadCgiBin : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad CgiBin path"; }
    };
    class BadUploads : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad Uploads path"; }
    };
    class BadData : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad data path"; }
    };
    class BadAutoIndex : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: bad autoindex"; }
    };
    class BadHost : public std::exception
    {
    public:
        virtual const char *what() const throw() { return "Error: Host incorrect"; }
    };

private:
    std::string _Name;
    std::string _Host;
    std::string *_Methods;
    std::string *_UploadsMethods;
    std::map<int, std::string> _ErrorPages;
    std::map<std::string, std::string> _DataPaths;
    std::map<std::string, std::string> _CgiPaths;
    std::vector<int> _Port;
    size_t _BodySize;
    int _NumberMethods;
    int _NumberPorts;
    int _nbUploadsMethods;
    bool _AutoIndex;
};

#endif